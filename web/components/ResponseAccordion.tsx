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
  const parts = text.split(/^(#{1,2} .+)$/m);

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
    const title = parts[i].replace(/^#{1,2} /, '').trim();
    const content = (parts[i + 1] || '').trim();
    if (title || content) {
      sections.push({ title, content, defaultOpen: i === 1 });
    }
  }

  return sections.length > 0 ? sections : [{ title: 'Resposta', content: text, defaultOpen: true }];
}

const COR_BORDA: Record<string, string> = {
  violet:  'border-violet-200 hover:border-violet-300',
  purple:  'border-purple-200 hover:border-purple-300',
  blue:    'border-blue-200 hover:border-blue-300',
  sky:     'border-sky-200 hover:border-sky-300',
  green:   'border-green-200 hover:border-green-300',
  emerald: 'border-emerald-200 hover:border-emerald-300',
  amber:   'border-amber-200 hover:border-amber-300',
  cyan:    'border-cyan-200 hover:border-cyan-300',
  rose:    'border-rose-200 hover:border-rose-300',
};

const COR_HEADER_BG: Record<string, string> = {
  violet:  'bg-violet-50/80 text-violet-800 hover:bg-violet-100/80',
  purple:  'bg-purple-50/80 text-purple-800 hover:bg-purple-100/80',
  blue:    'bg-blue-50/80 text-blue-800 hover:bg-blue-100/80',
  sky:     'bg-sky-50/80 text-sky-800 hover:bg-sky-100/80',
  green:   'bg-green-50/80 text-green-800 hover:bg-green-100/80',
  emerald: 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80',
  amber:   'bg-amber-50/80 text-amber-800 hover:bg-amber-100/80',
  cyan:    'bg-cyan-50/80 text-cyan-800 hover:bg-cyan-100/80',
  rose:    'bg-rose-50/80 text-rose-800 hover:bg-rose-100/80',
};

const COR_TABLE_TH: Record<string, string> = {
  violet:  'bg-violet-50 text-violet-700',
  purple:  'bg-purple-50 text-purple-700',
  blue:    'bg-blue-50 text-blue-700',
  sky:     'bg-sky-50 text-sky-700',
  green:   'bg-green-50 text-green-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber:   'bg-amber-50 text-amber-700',
  cyan:    'bg-cyan-50 text-cyan-700',
  rose:    'bg-rose-50 text-rose-700',
};

function EvidenciaBadge({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower === 'forte') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-success/12 text-success border border-success/20">
        ● Forte
      </span>
    );
  }
  if (lower === 'moderada') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-warning/12 text-warning border border-warning/20">
        ● Moderada
      </span>
    );
  }
  if (lower === 'fraca' || lower === 'limitada' || lower === 'empírica') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-muted text-muted-fg border border-border">
        ● {label}
      </span>
    );
  }
  return null;
}

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(c => extractText(c as React.ReactNode)).join('');
  }
  return '';
}

interface Props {
  conteudo: string;
  cor: string;
  carregando: boolean;
}

function MarkdownContent({ content, cor }: { content: string; cor: string }) {
  const thClass = COR_TABLE_TH[cor] || COR_TABLE_TH.blue;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-base font-bold text-gray-800 mt-4 mb-2 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-gray-800 mt-3 mb-1.5 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-fg mt-3 mb-1.5 first:mt-0">{children}</h3>,
        p: ({ children }) => <p className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-500">{children}</em>,
        ul: ({ children }) => <ul className="text-sm text-gray-700 space-y-1 mb-2 pl-4 list-disc">{children}</ul>,
        ol: ({ children }) => <ol className="text-sm text-gray-700 space-y-1 mb-2 pl-4 list-decimal">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        hr: () => <hr className="border-border my-4" />,
        code: ({ children }) => (
          <code className="bg-muted text-gray-700 text-xs px-1.5 py-0.5 rounded font-mono">{children}</code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-border pl-3 text-muted-fg italic my-2">{children}</blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-xl border border-border shadow-sm">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className={thClass}>{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
        tr: ({ children }) => <tr className="hover:bg-muted/50 even:bg-muted/30 transition-colors">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wider font-semibold border-b border-border">
            {children}
          </th>
        ),
        td: ({ children }) => {
          const text = extractText(children).trim();
          const badge = <EvidenciaBadge label={text} />;
          const hasBadge = ['forte', 'moderada', 'fraca', 'limitada', 'empírica'].includes(text.toLowerCase());
          return (
            <td className="px-4 py-3 text-gray-700 align-top leading-relaxed">
              {hasBadge ? badge : children}
            </td>
          );
        },
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

  const isLastSection = (i: number) => i === sections.length - 1;

  function sectionBadge(section: Section, i: number) {
    if (carregando && isLastSection(i)) {
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-fg font-medium shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-fg animate-pulse inline-block" />
          Gerando
        </span>
      );
    }
    if (section.content.length > 40) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-medium shrink-0">
          Concluído
        </span>
      );
    }
    return null;
  }

  return (
    <div className="space-y-2">
      {sections.map((section, i) => (
        <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-200 ${borderClass}`}>
          <button
            onClick={() => toggleSection(i)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm transition-colors duration-200 ${headerClass}`}
          >
            <span className="truncate mr-2">{section.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              {sectionBadge(section, i)}
              {openSections[i]
                ? <ChevronUp size={14} className="opacity-50" />
                : <ChevronDown size={14} className="opacity-50" />
              }
            </div>
          </button>
          {openSections[i] && section.content && (
            <div className="px-5 py-4 bg-card">
              <MarkdownContent content={section.content} cor={cor} />
            </div>
          )}
        </div>
      ))}
      {carregando && sections.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-2 text-muted-fg text-sm">
          <span className="inline-block w-1.5 h-4 bg-muted animate-pulse rounded-sm" />
          <span>Gerando...</span>
        </div>
      )}
    </div>
  );
}
