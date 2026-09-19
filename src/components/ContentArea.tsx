import React, { useState, useEffect } from 'react';
import { Topic, SubTopic } from '../types';
import { Menu, Eye, EyeOff, Sparkles, CheckCircle2, Bookmark, HelpCircle, ArrowUp, Target, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarkdownRenderer, highlightSearchMatch } from './MarkdownRenderer';
import { IconRenderer } from './IconRenderer';

interface ContentAreaProps {
  topic: Topic | undefined;
  jumpTarget: { subTopicId: string; query?: string; timestamp: number } | null;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenSidebar: () => void;
  onOpenSidebarWithSearch?: () => void;
}

// Individual interactive keyword card for Fill-in-the-Blank memory practice
const ClozeKeywordPill: React.FC<{ 
  keyword: string; 
  isClozeMode: boolean; 
  isRevealed: boolean; 
  onToggle: () => void;
  searchQuery?: string;
  isHighlighted?: boolean;
}> = ({ keyword, isClozeMode, isRevealed, onToggle, searchQuery, isHighlighted }) => {
  const isMatch = !!(searchQuery && keyword.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  if (!isClozeMode) {
    return (
      <span 
        data-search-highlight={isMatch ? "true" : undefined}
        data-keyword-pill="true"
        className={`inline-flex items-center min-h-[32px] sm:min-h-0 px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-md text-xs font-semibold transition-all duration-300 shadow-2xs ${
          isMatch && isHighlighted
            ? 'bg-amber-300 text-slate-950 font-bold ring-4 ring-amber-400/90 shadow-md scale-105 z-10'
            : isMatch
            ? 'bg-yellow-200 text-slate-900 ring-2 ring-yellow-400 font-bold'
            : 'bg-amber-100 text-amber-900 border border-amber-200'
        }`}
      >
        {keyword}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      data-search-highlight={isMatch ? "true" : undefined}
      data-keyword-pill="true"
      className={`inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-medium transition-all duration-300 cursor-pointer shadow-2xs select-none active:scale-98 ${
        isMatch && isHighlighted
          ? 'bg-amber-300 text-slate-950 font-bold ring-4 ring-amber-400/90 shadow-md scale-105 z-10'
          : isRevealed 
          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 ring-1 ring-emerald-400/30 active:bg-emerald-200' 
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 active:bg-slate-400 border border-slate-300'
      }`}
      title={isRevealed ? '点击遮盖' : '点击显示填空答案'}
    >
      {isRevealed || (isMatch && isHighlighted) ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{keyword}</span>
        </>
      ) : (
        <>
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-slate-600 font-sans">点击揭晓填空</span>
        </>
      )}
    </button>
  );
};

export const ContentArea: React.FC<ContentAreaProps> = ({ 
  topic, 
  jumpTarget, 
  searchQuery = '', 
  setSearchQuery,
  onOpenSidebar,
  onOpenSidebarWithSearch 
}) => {
  const [isClozeMode, setIsClozeMode] = useState(false);
  const [revealedKeywords, setRevealedKeywords] = useState<Record<string, boolean>>({});
  const [activeHighlightedId, setActiveHighlightedId] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Search jump target and 5-second countdown highlight state
  const [highlightTarget, setHighlightTarget] = useState<{
    subTopicId: string;
    query: string;
    timestamp: number;
  } | null>(null);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 5-second countdown timer
  useEffect(() => {
    if (!isHighlightActive || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsHighlightActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isHighlightActive, highlightTarget?.timestamp]);

  // Reliable scroll and locate executor that homes directly into the exact search match
  const scrollToExactTarget = (subId: string, query?: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 * 50ms = 1.5s window to ensure DOM & Markdown are completely mounted

    const performScroll = () => {
      const cardEl = document.getElementById(subId);
      if (!cardEl) return false;

      let targetElement: HTMLElement | null = null;
      const cleanQuery = query?.trim().toLowerCase();

      if (cleanQuery) {
        // 1. Look for search highlight marks inside this subtopic card
        const markEls = cardEl.querySelectorAll<HTMLElement>('[data-search-highlight="true"]');
        for (let i = 0; i < markEls.length; i++) {
          const el = markEls[i];
          if (el.textContent && el.textContent.toLowerCase().includes(cleanQuery)) {
            targetElement = el;
            break;
          }
        }

        // 2. Look for matching keyword pills
        if (!targetElement) {
          const pillEls = cardEl.querySelectorAll<HTMLElement>('[data-keyword-pill="true"]');
          for (let i = 0; i < pillEls.length; i++) {
            const pill = pillEls[i];
            if (pill.textContent && pill.textContent.toLowerCase().includes(cleanQuery)) {
              targetElement = pill;
              break;
            }
          }
        }

        // 3. Look for subtopic heading
        if (!targetElement) {
          const h3 = cardEl.querySelector<HTMLElement>('h3');
          if (h3 && h3.textContent && h3.textContent.toLowerCase().includes(cleanQuery)) {
            targetElement = h3;
          }
        }

        // 4. Walk DOM text nodes if mark hasn't rendered yet
        if (!targetElement) {
          const walker = document.createTreeWalker(cardEl, NodeFilter.SHOW_TEXT);
          let node = walker.nextNode();
          while (node) {
            if (node.nodeValue && node.nodeValue.toLowerCase().includes(cleanQuery)) {
              if (node.parentElement && node.parentElement !== cardEl) {
                targetElement = node.parentElement;
                break;
              }
            }
            node = walker.nextNode();
          }
        }
      }

      // If query was specified but no matching inner element was found yet,
      // wait for MarkdownRenderer to finish rendering on initial attempts
      if (cleanQuery && !targetElement && attempts < maxAttempts) {
        return false;
      }

      // Element to center and scroll to (either specific inner match or the card header)
      const elToScroll = targetElement || cardEl;

      const rect = elToScroll.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 700;

      // Center in viewport, leaving comfortable room for 64px sticky header
      const idealCenter = scrollTop + rect.top - (viewportHeight / 2) + (rect.height / 2);
      const minTop = scrollTop + rect.top - 88;
      const finalY = Math.max(0, targetElement ? Math.min(idealCenter, minTop) : minTop);

      window.scrollTo({
        top: finalY,
        behavior: 'smooth'
      });

      if (document.documentElement && document.documentElement.scrollTo) {
        document.documentElement.scrollTo({
          top: finalY,
          behavior: 'smooth'
        });
      }

      try {
        elToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (_) {}

      setActiveHighlightedId(subId);
      setTimeout(() => {
        setActiveHighlightedId(null);
      }, 3000);

      return true;
    };

    if (!performScroll()) {
      const timer = setInterval(() => {
        attempts++;
        if (performScroll() || attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, 50);
    }
  };

  // Auto-scroll logic:
  // 1. If jumpTarget is specified, smoothly scroll directly to the exact matched location
  // 2. If no jumpTarget (regular tab switch), automatically reset scroll to top
  useEffect(() => {
    if (jumpTarget && jumpTarget.subTopicId) {
      const q = jumpTarget.query ? jumpTarget.query.trim() : '';
      if (q) {
        setHighlightTarget({
          subTopicId: jumpTarget.subTopicId,
          query: q,
          timestamp: jumpTarget.timestamp
        });
        setIsHighlightActive(true);
        setCountdown(3);
      } else {
        setHighlightTarget(null);
        setIsHighlightActive(false);
        setCountdown(0);
      }
      scrollToExactTarget(jumpTarget.subTopicId, q);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement && document.documentElement.scrollTo) {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      setActiveHighlightedId(null);
      setHighlightTarget(null);
      setIsHighlightActive(false);
      setCountdown(0);
    }
  }, [topic?.id, jumpTarget]);

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white lg:ml-80 min-h-screen p-4">
        <p className="text-slate-500 text-sm">请选择左侧复习考点模块</p>
      </div>
    );
  }

  const handleJumpToSubtopic = (subId: string) => {
    scrollToExactTarget(subId);
  };

  const toggleKeyword = (key: string) => {
    setRevealedKeywords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRevealAll = (reveal: boolean) => {
    const updated: Record<string, boolean> = {};
    topic.subTopics.forEach(sub => {
      sub.highlightedKeywords.forEach(kw => {
        const key = `${sub.id}-${kw}`;
        updated[key] = reveal;
      });
    });
    setRevealedKeywords(updated);
  };

  return (
    <div className="flex-1 w-full lg:ml-80 min-h-screen bg-slate-50/50 flex flex-col min-w-0">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          {/* Hamburger Menu on mobile/tablet */}
          <button 
            type="button"
            onClick={onOpenSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 active:bg-slate-100 rounded-lg lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
            aria-label="打开考点目录与搜索"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hidden sm:flex shrink-0">
              <IconRenderer name={topic.icon} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight truncate">
                  {topic.title}
                </h2>
                {topic.badge && (
                  <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">
                    {topic.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Mobile Search + Cloze Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Search trigger button on mobile/tablet */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSidebarWithSearch) {
                onOpenSidebarWithSearch();
              } else {
                onOpenSidebar();
              }
            }}
            className="lg:hidden flex items-center justify-center p-2 text-slate-600 hover:text-blue-600 active:bg-blue-50 rounded-lg min-h-[44px] min-w-[44px] cursor-pointer"
            aria-label="搜索考点"
            title="搜索考点"
          >
            <Search className="w-4 h-4" />
          </button>

          {isClozeMode && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRevealAll(true)}
                className="text-xs px-2.5 py-1.5 min-h-[36px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-md font-medium transition cursor-pointer"
              >
                全显
              </button>
              <button
                type="button"
                onClick={() => handleRevealAll(false)}
                className="text-xs px-2.5 py-1.5 min-h-[36px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-md font-medium transition cursor-pointer"
              >
                全遮
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsClozeMode(!isClozeMode)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-2xs min-h-[40px] sm:min-h-[36px] cursor-pointer active:scale-98 ${
              isClozeMode 
                ? 'bg-amber-500 text-white shadow-amber-500/20' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            {isClozeMode ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="hidden xs:inline">{isClozeMode ? '挖空模式' : '填空自测'}</span>
            <span className="xs:hidden">{isClozeMode ? '已挖空' : '自测'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Module Description Banner */}
        {topic.description && (
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200/70 rounded-xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
              <span className="font-semibold text-slate-900">模块提要：</span>
              {topic.description}
            </div>
          </div>
        )}

        {/* Sub-topics Quick Jump Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1 sm:pb-2 overflow-x-auto -webkit-overflow-scrolling-touch">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 mr-1 shrink-0">考点直达:</span>
          {topic.subTopics.map((sub, idx) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => handleJumpToSubtopic(sub.id)}
              className={`text-xs px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer border min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                activeHighlightedId === sub.id
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border-slate-200 active:bg-blue-100'
              }`}
            >
              {sub.title.split(' ')[0] || `考点${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Cloze Mode Alert Helper on Mobile / Tablet */}
        {isClozeMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span className="leading-snug">
                <strong>已启用填空题挖空测试！</strong> 核心考点已遮盖，点击卡片直接揭晓核对。
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button 
                type="button"
                onClick={() => handleRevealAll(true)} 
                className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold min-h-[32px] cursor-pointer"
              >
                一键全揭晓
              </button>
              <button 
                type="button"
                onClick={() => handleRevealAll(false)} 
                className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold min-h-[32px] cursor-pointer"
              >
                一键全遮盖
              </button>
            </div>
          </div>
        )}

        {/* Sub-topics Detail List */}
        <motion.div
          key={topic.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          className="space-y-8"
        >
          {topic.subTopics.map((subTopic: SubTopic, idx: number) => {
            const isTargeted = activeHighlightedId === subTopic.id;
            const isTargetSubtopic = highlightTarget?.subTopicId === subTopic.id;
            const isIntenseHighlight = isTargetSubtopic && isHighlightActive;
            const activeQuery = isTargetSubtopic && isHighlightActive
              ? highlightTarget.query
              : (searchQuery?.trim() || '');

            return (
              <section 
                key={subTopic.id || idx}
                id={subTopic.id}
                className={`bg-white rounded-2xl p-4 sm:p-6 lg:p-7 border scroll-mt-20 sm:scroll-mt-24 transition-all duration-500 relative max-w-full overflow-hidden ${
                  isIntenseHighlight
                    ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-xl bg-amber-50/10'
                    : isTargeted 
                    ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg bg-blue-50/10' 
                    : 'border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Subtopic Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap min-w-0">
                    <span className={`w-1.5 h-4 sm:h-5 rounded-full shrink-0 ${
                      isIntenseHighlight ? 'bg-amber-500 animate-pulse' : isTargeted ? 'bg-blue-600 animate-pulse' : 'bg-blue-600'
                    }`} />
                    <span className="break-words min-w-0">{highlightSearchMatch(subTopic.title, activeQuery, isIntenseHighlight)}</span>
                    {isIntenseHighlight && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-bounce shadow-xs shrink-0">
                        <Target className="w-3 h-3" /> 命中搜索词 ({countdown}s)
                      </span>
                    )}
                    {!isIntenseHighlight && isTargeted && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-bounce shrink-0">
                        <Target className="w-3 h-3" /> 已定位
                      </span>
                    )}
                  </h3>
                  {subTopic.tag && (
                    <span className="self-start sm:self-auto text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200 shrink-0">
                      {subTopic.tag}
                    </span>
                  )}
                </div>

                {/* Subtopic Keywords Pill Box */}
                {subTopic.highlightedKeywords && subTopic.highlightedKeywords.length > 0 && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-xs font-semibold text-slate-600">
                      <Bookmark className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{isClozeMode ? '核心填空词自测（点击翻看）：' : '核心填空词与秒杀关键字：'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {subTopic.highlightedKeywords.map((kw, kwIdx) => {
                        const uniqueKey = `${subTopic.id}-${kw}`;
                        const isRevealed = !!revealedKeywords[uniqueKey];
                        return (
                          <ClozeKeywordPill
                            key={kwIdx}
                            keyword={kw}
                            isClozeMode={isClozeMode}
                            isRevealed={isRevealed}
                            onToggle={() => toggleKeyword(uniqueKey)}
                            searchQuery={activeQuery}
                            isHighlighted={isIntenseHighlight}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subtopic Main Markdown Content */}
                <MarkdownRenderer 
                  content={subTopic.content}
                  searchQuery={activeQuery}
                  isHighlighted={isIntenseHighlight}
                />
              </section>
            );
          })}
        </motion.div>

        {/* Floating 3-Second Search Highlight Toast */}
        <AnimatePresence>
          {isHighlightActive && highlightTarget?.query && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 flex flex-col gap-2 p-3 sm:p-3.5 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-amber-400/40 backdrop-blur-md max-w-none sm:max-w-sm"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                  <span className="font-semibold text-slate-200">已直达具体位置</span>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  高亮中 {countdown}s
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1.5 min-w-0">
                <span className="text-slate-400 shrink-0">搜索内容:</span>
                <span className="font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 truncate min-w-0">
                  {highlightTarget.query}
                </span>
              </div>
              {/* 3-second progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden mt-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(countdown / 3) * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to top button */}
        <div className="flex justify-center pt-2 sm:pt-4 pb-10 sm:pb-12">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-full border border-slate-200 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 text-blue-600" />
            <span>返回页面顶部</span>
          </button>
        </div>
      </main>
    </div>
  );
};

