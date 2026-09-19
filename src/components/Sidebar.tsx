import React, { useMemo } from 'react';
import { Topic, SubTopic } from '../types';
import { IconRenderer } from './IconRenderer';
import { Search, Sparkles, BookOpen, X, ArrowRight, Tag } from 'lucide-react';

interface SidebarProps {
  topics: Topic[];
  selectedId: string;
  onSelect: (topicId: string, subTopicId?: string, query?: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  topics, 
  selectedId, 
  onSelect, 
  isOpen, 
  setIsOpen,
  searchQuery,
  setSearchQuery
}) => {
  // Deep search results across all subtopics
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: {
      topic: Topic;
      subTopic: SubTopic;
      matchType: 'title' | 'keyword' | 'content';
      matchDetail?: string;
    }[] = [];

    topics.forEach(topic => {
      topic.subTopics.forEach(sub => {
        // 1. Check title
        if (sub.title.toLowerCase().includes(q)) {
          results.push({ topic, subTopic: sub, matchType: 'title' });
          return;
        }
        // 2. Check keywords
        const matchedKw = sub.highlightedKeywords.find(k => k.toLowerCase().includes(q));
        if (matchedKw) {
          results.push({ topic, subTopic: sub, matchType: 'keyword', matchDetail: matchedKw });
          return;
        }
        // 3. Check content snippet
        const contentLower = sub.content.toLowerCase();
        const matchIdx = contentLower.indexOf(q);
        if (matchIdx !== -1) {
          const start = Math.max(0, matchIdx - 14);
          const end = Math.min(sub.content.length, matchIdx + q.length + 18);
          const snippet = sub.content.slice(start, end).replace(/[#*`|\n\r]/g, ' ').trim();
          results.push({ topic, subTopic: sub, matchType: 'content', matchDetail: `...${snippet}...` });
        }
      });
    });

    return results;
  }, [topics, searchQuery]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const query = searchQuery.toLowerCase();
    return topics.filter(topic => {
      const matchesTitle = topic.title.toLowerCase().includes(query);
      const matchesSub = topic.subTopics.some(s => 
        s.title.toLowerCase().includes(query) || 
        s.highlightedKeywords.some(k => k.toLowerCase().includes(query)) ||
        s.content.toLowerCase().includes(query)
      );
      return matchesTitle || matchesSub;
    });
  }, [topics, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-80 bg-slate-50/95 backdrop-blur-md border-r border-slate-200 
        transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">三级数据库复习宝典</h1>
              <p className="text-[11px] text-slate-500 font-medium">全国计算机等级考试（NCRE）</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-slate-200/80 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  const first = searchResults[0];
                  onSelect(first.topic.id, first.subTopic.id, searchQuery.trim());
                  setIsOpen(false);
                }
              }}
              placeholder="搜索考点、SQL、口诀、图元 (Enter直达)..."
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isSearching && (
            <div className="flex items-center justify-between mt-1.5 px-0.5 text-[11px] text-slate-500">
              <span>找到 <strong>{searchResults.length}</strong> 个精确考点</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:underline"
              >
                清空搜索
              </button>
            </div>
          )}
        </div>
        
        {/* Navigation / Search Results list */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {/* SEARCH MODE: Direct Subtopic Results */}
          {isSearching ? (
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 px-1 mb-2 uppercase tracking-wider flex items-center justify-between">
                    <span>🎯 直达具体考点卡片 ({searchResults.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.map((item, idx) => (
                      <button
                        key={`${item.subTopic.id}-${idx}`}
                        type="button"
                        onClick={() => {
                          onSelect(item.topic.id, item.subTopic.id, searchQuery.trim());
                          setIsOpen(false);
                        }}
                        className="w-full p-2.5 bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group shadow-2xs cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1 pointer-events-none">
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 truncate max-w-[170px]">
                            {item.topic.title}
                          </span>
                          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 shrink-0 opacity-90 group-hover:opacity-100">
                            跳转直达 <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-800 line-clamp-1 pointer-events-none">
                          {item.subTopic.title}
                        </div>
                        {item.matchDetail && (
                          <div className="mt-1 text-[11px] text-amber-800 bg-amber-50/80 rounded px-1.5 py-0.5 border border-amber-200/50 flex items-center gap-1 pointer-events-none">
                            <Tag className="w-2.5 h-2.5 shrink-0 text-amber-600" />
                            <span className="truncate">匹配：{item.matchDetail}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Matching Modules */}
              {filteredTopics.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 px-1 mb-2 uppercase tracking-wider">
                    📁 匹配的复习大纲模块 ({filteredTopics.length})
                  </div>
                  <div className="space-y-1">
                    {filteredTopics.map(topic => {
                      const isSelected = selectedId === topic.id;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            onSelect(topic.id);
                            setIsOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-2 p-2 rounded-lg text-left transition text-xs
                            ${isSelected ? 'bg-blue-600 text-white font-medium' : 'text-slate-700 hover:bg-slate-200/60'}
                          `}
                        >
                          <div className={`p-1 rounded shrink-0 ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            <IconRenderer name={topic.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate flex-1">{topic.title}</span>
                          <span className="text-[10px] opacity-75 shrink-0">{topic.subTopics.length}考点</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && filteredTopics.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-xs font-medium text-slate-600">未找到匹配考点</p>
                  <p className="text-[11px] text-slate-400 mt-1">可输入：ICOM、IDEF0、触发器、游标、索引、螺旋模型等</p>
                </div>
              )}
            </div>
          ) : (
            /* NORMAL TOPIC MODULE NAVIGATION */
            <div className="space-y-1">
              {filteredTopics.map((topic) => {
                const isSelected = selectedId === topic.id;
                const isSpecialFillIn = topic.id === 'fill-in-the-blanks';

                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onSelect(topic.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all relative
                      ${isSpecialFillIn && !isSelected ? 'border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50/50 hover:bg-amber-100/60' : ''}
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-sm font-medium' 
                        : !isSpecialFillIn ? 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900' : ''}
                    `}
                  >
                    <div className={`
                      mt-0.5 p-1.5 rounded-lg shrink-0
                      ${isSelected ? 'bg-blue-700/50 text-white' : isSpecialFillIn ? 'bg-amber-200/70 text-amber-800' : 'bg-slate-200/60 text-slate-600'}
                    `}>
                      <IconRenderer name={topic.icon} className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {topic.title}
                        </span>
                        {topic.badge && (
                          <span className={`
                            text-[10px] px-1.5 py-0.2 rounded-full whitespace-nowrap font-medium shrink-0
                            ${isSelected 
                              ? 'bg-blue-500 text-blue-50' 
                              : isSpecialFillIn 
                                ? 'bg-amber-500 text-white font-bold animate-pulse' 
                                : 'bg-slate-200 text-slate-600'}
                          `}>
                            {topic.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {topic.subTopics.length} 个核心专题考点
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer summary info */}
        <div className="p-3 border-t border-slate-200 bg-white shrink-0">
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>10大模块 · 35+专题考点</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">覆盖三级数据库95%+全考纲要求</p>
          </div>
        </div>
      </aside>
    </>
  );
};

