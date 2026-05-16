'use client';

import { useState } from 'react';
import { FaseKey, FASES, ORDEM_FASES } from '@/lib/types';
import { Send, SkipForward, Download, Loader2, Play, CheckCircle, RotateCcw } from 'lucide-react';

interface Props {
  faseKey: FaseKey;
  sessaoId: string;
  temConteudo: boolean;
  carregando: boolean;
  faseAtiva: FaseKey;
  formulaConfirmada: boolean;
  onIniciar: () => void;
  onAjuste: (texto: string) => void;
  onProximaFase: () => void;
  onExportar: () => void;
  onConfirmarFormula: () => void;
  onRetornarFase1?: () => void;
}

export function BarraAcoes({
  faseKey, temConteudo, carregando,
  faseAtiva, formulaConfirmada,
  onIniciar, onAjuste, onProximaFase, onExportar,
  onConfirmarFormula, onRetornarFase1,
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
  const bloqueadoSemFormula = faseAtiva === '1' && temConteudo && !formulaConfirmada;

  return (
    <div className="border-t border-border bg-card/95 backdrop-blur-sm px-5 py-3.5 shrink-0">
      {!temConteudo ? (
        /* Estado inicial — só botão de iniciar */
        <div className="flex justify-center">
          <button
            onClick={onIniciar}
            disabled={carregando}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-fg rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
          >
            {carregando ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            Iniciar fase
          </button>
        </div>
      ) : (
        /* Estado com conteúdo — barra completa em uma linha */
        <div className="flex items-center gap-3">
          {/* Input de ajuste (flex-1) */}
          <div className="flex flex-1 gap-2 min-w-0">
            <input
              type="text"
              value={ajuste}
              onChange={e => setAjuste(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnviarAjuste()}
              placeholder="Peça um ajuste ao agente..."
              disabled={carregando}
              className="flex-1 text-sm border border-border rounded-lg px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:bg-muted transition-all min-w-0"
            />
            <button
              onClick={handleEnviarAjuste}
              disabled={!ajuste.trim() || carregando}
              className="px-3.5 py-2 bg-muted text-muted-fg rounded-lg hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-sm font-medium shrink-0"
            >
              {carregando ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Enviar
            </button>
          </div>

          {/* Separador */}
          <div className="w-px h-8 bg-border shrink-0" />

          {/* Grupo de ações (direita) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Fase 1: confirmar fórmula */}
            {faseAtiva === '1' && (
              formulaConfirmada ? (
                <span className="flex items-center gap-1.5 px-3 py-2 bg-success/10 text-success rounded-lg text-sm font-medium border border-success/20">
                  <CheckCircle size={14} />
                  Confirmada
                </span>
              ) : (
                <button
                  onClick={onConfirmarFormula}
                  disabled={carregando}
                  className="flex items-center gap-1.5 px-4 py-2 bg-success text-success-fg rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
                >
                  <CheckCircle size={14} />
                  Confirmar Fórmula
                </button>
              )
            )}

            {/* Fase 3: retornar à fase 1 */}
            {faseAtiva === '3' && onRetornarFase1 && (
              <button
                onClick={onRetornarFase1}
                disabled={carregando}
                className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm text-muted-fg"
              >
                <RotateCcw size={13} />
                Voltar Fase 1
              </button>
            )}

            {/* Próxima fase */}
            {temProxima && (
              <button
                onClick={onProximaFase}
                disabled={carregando || bloqueadoSemFormula}
                title={bloqueadoSemFormula ? 'Confirme a fórmula antes de avançar' : undefined}
                className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm text-gray-600"
              >
                <SkipForward size={14} />
                {proximaFase?.nome}
              </button>
            )}

            {/* Exportar — ghost */}
            <button
              onClick={onExportar}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted/60 transition-all text-sm text-muted-fg"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
