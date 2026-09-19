import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  searchQuery?: string;
  isHighlighted?: boolean;
}

// Safely extract plain text from React nodes (for clipboard copy)
export function extractPlainText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return props.children ? extractPlainText(props.children) : '';
  }
  return '';
}

// Recursively highlight matching text inside ReactNodes
export function highlightSearchMatch(
  node: React.ReactNode,
  query?: string,
  isHighlighted: boolean = false
): React.ReactNode {
  if (!query || !query.trim()) return node;

  const trimmed = query.trim();
  if (!trimmed) return node;

  if (typeof node === 'string') {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex: RegExp;
    try {
      regex = new RegExp(`(${escaped})`, 'gi');
    } catch {
      return node;
    }

    const parts = node.split(regex);
    if (parts.length <= 1) return node;

    return parts.map((part, i) => {
      if (part.toLowerCase() === trimmed.toLowerCase()) {
        return (
          <mark
            key={i}
            data-search-highlight="true"
            data-search-match={part}
            className={`transition-all duration-500 rounded px-1.5 py-0.5 mx-0.5 inline-block font-bold ${
              isHighlighted
                ? 'bg-amber-300 text-slate-950 ring-4 ring-amber-400/90 shadow-lg ring-offset-2 scale-105 z-20 animate-pulse'
                : 'bg-yellow-200/90 text-slate-900 border border-yellow-300/80 shadow-2xs'
            }`}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  }

  if (React.isValidElement(node)) {
    if (node.type === 'mark') return node;

    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    if (element.props && element.props.children) {
      return React.cloneElement(
        element,
        {},
        highlightSearchMatch(element.props.children, query, isHighlighted)
      );
    }
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>
        {highlightSearchMatch(child, query, isHighlighted)}
      </React.Fragment>
    ));
  }

  return node;
}

const CodeBlock = ({ 
  children, 
  className,
  searchQuery,
  isHighlighted
}: { 
  children: React.ReactNode; 
  className?: string;
  searchQuery?: string;
  isHighlighted?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const plainText = extractPlainText(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isInline = !className;

  if (isInline) {
    return (
      <code className="bg-slate-100 text-pink-600 font-mono text-sm px-1.5 py-0.5 rounded border border-slate-200">
        {highlightSearchMatch(children, searchQuery, isHighlighted)}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 border-b border-slate-700 text-xs text-slate-400 font-mono">
        <span>{className?.replace('language-', '').toUpperCase() || 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700 transition cursor-pointer"
          title="复制到剪贴板"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '已复制' : '复制代码'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-100">
        <code>{highlightSearchMatch(children, searchQuery, isHighlighted)}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content,
  searchQuery,
  isHighlighted = false
}) => {
  const sanitizedContent = React.useMemo(() => {
    if (!content) return '';
    return content.replace(/<br\s*\/?>/gi, ' ');
  }, [content]);

  return (
    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-slate-800 mt-4 mb-2">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-2.5 text-[15px] leading-relaxed">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-3 space-y-1.5 text-[15px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-3 space-y-1.5 text-[15px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/60">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50/70 px-4 py-2 my-3 rounded-r-lg text-slate-700 text-sm">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/90 text-slate-800 font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/80 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 text-left font-semibold text-slate-900 tracking-tight whitespace-nowrap">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 text-slate-700 align-top">
              {highlightSearchMatch(children, searchQuery, isHighlighted)}
            </td>
          ),
          code: ({ className, children }) => (
            <CodeBlock 
              className={className}
              searchQuery={searchQuery}
              isHighlighted={isHighlighted}
            >
              {children}
            </CodeBlock>
          )
        }}
      >
        {sanitizedContent}
      </Markdown>
    </div>
  );
};
