'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Section {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

function parseResponse(text: string): Section[] {
  const parts = text.split(/^(#{1,3} .+)$/m);

  if (parts.length <= 1) {
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim());
    if (paragraphs.length <= 1) return [{ title: 'Resposta', content: text, defaultOpen: true }];
    return paragraphs.map((p, i) => ({
      title: `Seção ${i + 1}`,
      content: p.trim(),
      defaultOpen: i === 0,
    }));
  }

  const sections: Section[] = [];
  if (parts[0].trim()) {
    sections.push({ title: 'Introdução', content: parts[0].trim(), defaultOpen: true });
  }

  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].replace(/^#{1,3} /, '').trim();
    const content = (parts[i + 1] || '').trim();
    if (title || content) {
      sections.push({ title, content, defaultOpen: i === 1 });
    }
  }

  return sections.length > 0 ? sections : [{ title: 'Resposta', content: text, defaultOpen: true }];
}

const COR_BORDA: Record<string, string> = {
  violet:  'border-violet-200 hover:border-violet-400',
  purple:  'border-purple-200 hover:border-purple-400',
  blue:    'border-blue-200 hover:border-blue-400',
  sky:     'border-sky-200 hover:border-sky-400',
  green:   'border-green-200 hover:border-green-400',
  emerald: 'border-emerald-200 hover:border-emerald-400',
  amber:   'border-amber-200 hover:border-amber-400',
  cyan:    'border-cyan-200 hover:border-cyan-400',
  rose:    'border-rose-200 hover:border-rose-400',
};

const COR_HEADER_BG: Record<string, string> = {
  violet:  'bg-violet-50 text-violet-800 hover:bg-violet-100',
  purple:  'bg-purple-50 text-purple-800 hover:bg-purple-100',
  blue:    'bg-blue-50 text-blue-800 hover:bg-blue-100',
  sky:     'bg-sky-50 text-sky-800 hover:bg-sky-100',
  green:   'bg-green-50 text-green-800 hover:bg-green-100',
  emerald: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  amber:   'bg-amber-50 text-amber-800 hover:bg-amber-100',
  cyan:    'bg-cyan-50 text-cyan-800 hover:bg-cyan-100',
  rose:    'bg-rose-50 text-rose-800 hover:bg-rose-100',
};

const COR_TABLE_HEAD: Record<string, string> = {
  violet:  'bg-violet-100 text-violet-900',
  purple:  'bg-purple-100 text-purple-900',
  blue:    'bg-blue-100 text-blue-900',
  sky:     'bg-sky-100 text-sky-900',
  green:   'bg-green-100 text-green-900',
  emerald: 'bg-emerald-100 text-emerald-900',
  amber:   'bg-amber-100 text-amber-900',
  cyan:    'bg-cyan-100 text-cyan-900',
  rose:    'bg-rose-100 text-rose-900',
};

interface Props {
  conteudo: string;
  cor: string;
  carregando: boolean;
}

function MarkdownContent({ content, cor }: { content: string; cor: string }) {
  const tableHead = COR_TABLE_HEAD[cor] || COR_TABLE_HEAD.blue;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-base font-bold text-gray-800 mt-4 mb-2 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-gray-800 mt-3 mb-1.5 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-700 mt-2 mb-1 first:mt-0">{children}</h3>,
        p: ({ children }) => <p className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
        ul: ({ children }) => <ul className="text-sm text-gray-700 space-y-1 mb-2 pl-4 list-disc">{children}</ul>,
        ol: ({ children }) => <ol className="text-sm text-gray-700 space-y-1 mb-2 pl-4 list-decimal">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        hr: () => <hr className="border-gray-100 my-3" />,
        code: ({ children }) => (
          <code className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded font-mono">{children}</code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gray-200 pl-3 text-gray-500 italic my-2">{children}</blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 rounded-lg border border-gray-100 shadow-sm">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className={tableHead}>{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>,
        tr: ({ children }) => <tr className="even:bg-gray-50/60">{children}</tr>,
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold text-xs uppercase tracking-wide first:rounded-tl-lg last:rounded-tr-lg">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-3 py-2 text-gray-700 align-top">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ResponseAccordion({ conteudo, cor, carregando }: Props) {
  const sections = parseResponse(conteudo);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(
    Object.fromEntries(sections.map((s, i) => [i, s.defaultOpen ?? false]))
  );

  const toggleSection = (i: number) => {
    setOpenSections(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const borderClass = COR_BORDA[cor] || COR_BORDA.blue;
  const headerClass = COR_HEADER_BG[cor] || COR_HEADER_BG.blue;

  return (
    <div className="space-y-2">
      {sections.map((section, i) => (
        <div key={i} className={`border rounded-xl overflow-hidden transition-all ${borderClass}`}>
          <button
            onClick={() => toggleSection(i)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm transition-colors ${headerClass}`}
          >
            <span>{section.title}</span>
            {openSections[i]
              ? <ChevronUp size={15} className="shrink-0 ml-2 opacity-60" />
              : <ChevronDown size={15} className="shrink-0 ml-2 opacity-60" />
            }
          </button>
          {openSections[i] && section.content && (
            <div className="px-5 py-4 bg-white">
              <MarkdownContent content={section.content} cor={cor} />
            </div>
          )}
        </div>
      ))}
      {carregando && (
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 text-sm">
          <span className="inline-block w-1.5 h-4 bg-gray-300 animate-pulse rounded-sm" />
          <span>Gerando...</span>
        </div>
      )}
    </div>
  );
}
