'use client';

import { FASES, FaseKey, ORDEM_FASES, Sessao } from '@/lib/types';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface Props {
  sessao: Sessao;
  faseAtiva: FaseKey;
  carregando: boolean;
  onSelectFase: (f: FaseKey) => void;
}

const COR_CLASSES: Record<string, string> = {
  violet:  'bg-violet-100 text-violet-700 border-violet-300',
  purple:  'bg-purple-100 text-purple-700 border-purple-300',
  blue:    'bg-blue-100 text-blue-700 border-blue-300',
  sky:     'bg-sky-100 text-sky-700 border-sky-300',
  green:   'bg-green-100 text-green-700 border-green-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  amber:   'bg-amber-100 text-amber-700 border-amber-300',
  cyan:    'bg-cyan-100 text-cyan-700 border-cyan-300',
  rose:    'bg-rose-100 text-rose-700 border-rose-300',
};

export function FaseSidebar({ sessao, faseAtiva, carregando, onSelectFase }: Props) {
  const totalFases = ORDEM_FASES.length;
  const fasesCompletas = ORDEM_FASES.filter(f => sessao.outputs[`fase${f}`]).length;

  return (
    <aside className="w-64 shrink-0 border-r border-gray-100 bg-white flex flex-col">
      {/* Header do projeto */}
      <div className="px-5 py-5 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Projeto</p>
        <h2 className="font-semibold text-gray-800 text-sm leading-tight">
          {sessao.dadosIniciais.nomeProjeto}
        </h2>
        <p className="text-xs text-gray-400 mt-1 truncate">{sessao.dadosIniciais.indicacaoClinica}</p>

        {/* Barra de progresso */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progresso</span>
            <span>{fasesCompletas}/{totalFases}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${(fasesCompletas / totalFases) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lista de fases */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {ORDEM_FASES.map(faseKey => {
          const fase = FASES[faseKey];
          const concluida = !!sessao.outputs[`fase${faseKey}`];
          const ativa = faseKey === faseAtiva;
          const cor = COR_CLASSES[fase.cor] || COR_CLASSES.blue;

          return (
            <button
              key={faseKey}
              onClick={() => onSelectFase(faseKey)}
              disabled={carregando}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-sm group
                ${ativa ? `${cor} border font-medium` : 'text-gray-600 hover:bg-gray-50'}
                ${carregando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="shrink-0">
                {ativa && carregando ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : concluida ? (
                  <CheckCircle size={15} className={ativa ? '' : 'text-green-500'} />
                ) : (
                  <Circle size={15} className="text-gray-300" />
                )}
              </span>
              <span className="truncate leading-tight">{fase.nome}</span>
            </button>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-300 text-center">PharmaHub © 2025</p>
      </div>
    </aside>
  );
}
