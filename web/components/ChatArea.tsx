'use client';

import { FASES, FaseKey } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { ResponseAccordion } from '@/components/ResponseAccordion';

interface Props {
  faseKey: FaseKey;
  conteudo: string;
  carregando: boolean;
}

const COR_HEADER: Record<string, string> = {
  violet:  'bg-violet-50/60 border-violet-100 text-violet-700',
  purple:  'bg-purple-50/60 border-purple-100 text-purple-700',
  blue:    'bg-blue-50/60 border-blue-100 text-blue-700',
  sky:     'bg-sky-50/60 border-sky-100 text-sky-700',
  green:   'bg-green-50/60 border-green-100 text-green-700',
  emerald: 'bg-emerald-50/60 border-emerald-100 text-emerald-700',
  amber:   'bg-amber-50/60 border-amber-100 text-amber-700',
  cyan:    'bg-cyan-50/60 border-cyan-100 text-cyan-700',
  rose:    'bg-rose-50/60 border-rose-100 text-rose-700',
};

export function ChatArea({ faseKey, conteudo, carregando }: Props) {
  const fase = FASES[faseKey];
  const cor = COR_HEADER[fase.cor] || COR_HEADER.blue;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header da fase */}
      <div className={`${cor} border-b px-6 py-4`}>
        <h1 className="text-base font-semibold">{fase.nomeCompleto}</h1>
        <p className="text-xs text-gray-400 mt-0.5">Agente: {fase.agente}</p>
      </div>

      {/* Área de conteúdo */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {carregando && !conteudo && (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Consultando agente farmacêutico...</span>
          </div>
        )}

        {!carregando && !conteudo && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-300 gap-3">
            <span className="text-5xl opacity-30">💊</span>
            <p className="text-sm">Clique em <strong>&quot;Iniciar fase&quot;</strong> para consultar o agente.</p>
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
