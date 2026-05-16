'use client';

import { useState } from 'react';
import { FaseKey, FASES, ORDEM_FASES } from '@/lib/types';
import { Send, SkipForward, Download, Loader2, Play } from 'lucide-react';

interface Props {
  faseKey: FaseKey;
  sessaoId: string;
  temConteudo: boolean;
  carregando: boolean;
  onIniciar: () => void;
  onAjuste: (texto: string) => void;
  onProximaFase: () => void;
  onExportar: () => void;
}

export function BarraAcoes({
  faseKey, temConteudo, carregando,
  onIniciar, onAjuste, onProximaFase, onExportar,
}: Props) {
  const [ajuste, setAjuste] = useState('');

  const handleEnviarAjuste = () => {
    if (!ajuste.trim() || carregando) return;
    onAjuste(ajuste.trim());
    setAjuste('');
  };

  const idxAtual = ORDEM_FASES.indexOf(faseKey);
  const temProxima = idxAtual < ORDEM_FASES.length - 1;
  const proximaFase = temProxima ? FASES[ORDEM_FASES[idxAtual + 1]] : null;

  return (
    <div className="border-t border-gray-100 bg-white px-6 py-4 space-y-3">
      {/* Campo de ajuste */}
      {temConteudo && (
        <div className="flex gap-2">
          <input
            type="text"
            value={ajuste}
            onChange={e => setAjuste(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEnviarAjuste()}
            placeholder="Peça um ajuste ao agente..."
            disabled={carregando}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:opacity-50 disabled:bg-gray-50 transition-all"
          />
          <button
            onClick={handleEnviarAjuste}
            disabled={!ajuste.trim() || carregando}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm font-medium"
          >
            {carregando ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Enviar
          </button>
        </div>
      )}

      {/* Ações principais */}
      <div className="flex items-center gap-2 flex-wrap">
        {!temConteudo && (
          <button
            onClick={onIniciar}
            disabled={carregando}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            {carregando ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            Iniciar fase
          </button>
        )}

        {temConteudo && temProxima && (
          <button
            onClick={onProximaFase}
            disabled={carregando}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm text-gray-600"
          >
            <SkipForward size={15} />
            Próxima: {proximaFase?.nome}
          </button>
        )}

        {temConteudo && (
          <button
            onClick={onExportar}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm text-gray-600 ml-auto"
          >
            <Download size={15} />
            Exportar Markdown
          </button>
        )}
      </div>
    </div>
  );
}
