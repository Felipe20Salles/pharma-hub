'use client';

import { FASES, FaseKey } from '@/lib/types';
import { Loader2, Microscope, CheckSquare, FileText, Tag, BookOpen, TrendingUp, Pill } from 'lucide-react';
import { ResponseAccordion } from '@/components/ResponseAccordion';

interface Props {
  faseKey: FaseKey;
  conteudo: string;
  carregando: boolean;
}

const COR_HEADER: Record<string, string> = {
  violet:  'bg-violet-50/60 border-violet-100',
  purple:  'bg-purple-50/60 border-purple-100',
  blue:    'bg-blue-50/60 border-blue-100',
  sky:     'bg-sky-50/60 border-sky-100',
  green:   'bg-green-50/60 border-green-100',
  emerald: 'bg-emerald-50/60 border-emerald-100',
  amber:   'bg-amber-50/60 border-amber-100',
  cyan:    'bg-cyan-50/60 border-cyan-100',
  rose:    'bg-rose-50/60 border-rose-100',
};

const COR_ICON_BG: Record<string, string> = {
  violet:  'bg-violet-100 text-violet-600',
  purple:  'bg-purple-100 text-purple-600',
  blue:    'bg-blue-100 text-blue-600',
  sky:     'bg-sky-100 text-sky-600',
  green:   'bg-green-100 text-green-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber:   'bg-amber-100 text-amber-600',
  cyan:    'bg-cyan-100 text-cyan-600',
  rose:    'bg-rose-100 text-rose-600',
};

const COR_AGENTE: Record<string, string> = {
  violet:  'bg-violet-100 text-violet-700',
  green:   'bg-green-100 text-green-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber:   'bg-amber-100 text-amber-700',
  cyan:    'bg-cyan-100 text-cyan-700',
  rose:    'bg-rose-100 text-rose-700',
};

const FASE_ICON: Record<string, React.ReactNode> = {
  violet:  <Microscope size={17} />,
  green:   <CheckSquare size={17} />,
  emerald: <FileText size={17} />,
  amber:   <Tag size={17} />,
  cyan:    <BookOpen size={17} />,
  rose:    <TrendingUp size={17} />,
};

export function ChatArea({ faseKey, conteudo, carregando }: Props) {
  const fase = FASES[faseKey];
  const headerBg = COR_HEADER[fase.cor] || COR_HEADER.blue;
  const iconBg = COR_ICON_BG[fase.cor] || COR_ICON_BG.blue;
  const agenteBadge = COR_AGENTE[fase.cor] || COR_AGENTE.violet;
  const icon = FASE_ICON[fase.cor] ?? <Microscope size={17} />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header da fase */}
      <div className={`${headerBg} border-b px-6 py-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-semibold text-gray-800">{fase.nomeCompleto}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agenteBadge}`}>
                {fase.agente}
              </span>
            </div>
            <p className="text-xs text-muted-fg mt-0.5">{fase.descricao}</p>
          </div>
          {carregando && (
            <div className="flex items-center gap-1.5 text-xs text-muted-fg shrink-0 pt-0.5">
              <Loader2 size={13} className="animate-spin" />
              <span>Gerando...</span>
            </div>
          )}
        </div>
      </div>

      {/* Área de conteúdo */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {carregando && !conteudo && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-fg">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg} animate-pulse`}>
              {icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Consultando agente farmacêutico</p>
              <p className="text-xs text-muted-fg mt-1">{fase.descricao}</p>
            </div>
          </div>
        )}

        {!carregando && !conteudo && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center opacity-40 ${iconBg}`}>
              <Pill size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pronto para iniciar</p>
              <p className="text-xs text-muted-fg mt-1">
                Clique em <strong className="text-gray-600">&quot;Iniciar fase&quot;</strong> para consultar o agente.
              </p>
            </div>
          </div>
        )}

        {conteudo && (
          <ResponseAccordion
            conteudo={conteudo}
            cor={fase.cor}
            carregando={carregando}
          />
        )}
      </div>
    </div>
  );
}
