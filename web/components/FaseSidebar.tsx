'use client';

import { FASES, FaseKey, ORDEM_FASES, Sessao } from '@/lib/types';
import { Check, Loader2, FlaskConical } from 'lucide-react';

interface Props {
  sessao: Sessao;
  faseAtiva: FaseKey;
  carregando: boolean;
  onSelectFase: (f: FaseKey) => void;
}

function RingProgress({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? value / total : 0;
  const r = 17;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor"
          className="text-muted" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor"
          className="text-primary" strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <FlaskConical size={15} className="text-primary" />
      </div>
    </div>
  );
}

export function FaseSidebar({ sessao, faseAtiva, carregando, onSelectFase }: Props) {
  const totalFases = ORDEM_FASES.length;
  const fasesCompletas = ORDEM_FASES.filter(f => sessao.outputs[`fase${f}`]).length;

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-start gap-3">
          <RingProgress value={fasesCompletas} total={totalFases} />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-medium text-muted-fg uppercase tracking-widest leading-none mb-1">Projeto</p>
            <h2 className="font-semibold text-gray-800 text-sm leading-tight truncate">
              {sessao.dadosIniciais.nomeProjeto}
            </h2>
            <p className="text-xs text-muted-fg mt-1 truncate">{sessao.dadosIniciais.indicacaoClinica}</p>
            <p className="text-xs text-muted-fg mt-1">
              {fasesCompletas}/{totalFases} fases
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <nav className="flex-1 overflow-y-auto py-5 px-4">
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[15px] top-5 bottom-5 w-px bg-border z-0" />

          <div className="space-y-1">
            {ORDEM_FASES.map((faseKey, idx) => {
              const concluida = !!sessao.outputs[`fase${faseKey}`];
              const ativa = faseKey === faseAtiva;
              const fase = FASES[faseKey];

              return (
                <button
                  key={faseKey}
                  onClick={() => onSelectFase(faseKey)}
                  disabled={carregando}
                  className={`relative flex items-center gap-3 w-full text-left py-2 px-2 rounded-xl transition-all
                    ${ativa ? 'bg-primary/8' : 'hover:bg-muted/60'}
                    ${carregando ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Step indicator */}
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold z-10 border-2 transition-all
                    ${concluida
                      ? 'bg-success border-success text-success-fg'
                      : ativa
                        ? 'bg-primary border-primary text-primary-fg ring-4 ring-primary/20'
                        : 'bg-card border-border text-muted-fg'
                    }`}>
                    {ativa && carregando
                      ? <Loader2 size={13} className="animate-spin" />
                      : concluida
                        ? <Check size={12} />
                        : <span>{idx + 1}</span>
                    }
                  </div>

                  {/* Label */}
                  <span className={`text-sm truncate leading-tight ${
                    ativa ? 'font-semibold text-primary'
                    : concluida ? 'text-gray-600'
                    : 'text-muted-fg'
                  }`}>
                    {fase.nome}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-fg text-center">PharmaHub © 2025</p>
      </div>
    </aside>
  );
}
