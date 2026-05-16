'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

function parseResponse(text: string): Section[] {
  // Split by ## headers
  const parts = text.split(/^(#{1,3} .+)$/m);

  if (parts.length <= 1) {
    // No headers found - split by double newlines into paragraphs
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim());
    if (paragraphs.length <= 1) return [{ title: 'Resposta', content: text, defaultOpen: true }];
    return paragraphs.map((p, i) => ({
      title: `Seção ${i + 1}`,
      content: p.trim(),
      defaultOpen: i === 0,
    }));
  }

  const sections: Section[] = [];
  // parts[0] is content before first header (intro)
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

const COR_HEADER: Record<string, string> = {
  violet:  'bg-violet-50 text-violet-800',
  purple:  'bg-purple-50 text-purple-800',
  blue:    'bg-blue-50 text-blue-800',
  sky:     'bg-sky-50 text-sky-800',
  green:   'bg-green-50 text-green-800',
  emerald: 'bg-emerald-50 text-emerald-800',
  amber:   'bg-amber-50 text-amber-800',
  cyan:    'bg-cyan-50 text-cyan-800',
  rose:    'bg-rose-50 text-rose-800',
};

interface Props {
  conteudo: string;
  cor: string;
  carregando: boolean;
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
  const headerClass = COR_HEADER[cor] || COR_HEADER.blue;

  return (
    <div className="space-y-2">
      {sections.map((section, i) => (
        <div key={i} className={`border rounded-xl overflow-hidden transition-all ${borderClass}`}>
          <button
            onClick={() => toggleSection(i)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm ${headerClass} transition-colors`}
          >
            <span>{section.title}</span>
            {openSections[i]
              ? <ChevronUp size={15} className="shrink-0 ml-2" />
              : <ChevronDown size={15} className="shrink-0 ml-2" />
            }
          </button>
          {openSections[i] && section.content && (
            <div className="px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white">
              {section.content}
            </div>
          )}
        </div>
      ))}
      {carregando && (
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 text-sm">
          <span className="inline-block w-2 h-4 bg-gray-300 animate-pulse rounded-sm" />
          <span>Gerando...</span>
        </div>
      )}
    </div>
  );
}
