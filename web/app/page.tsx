'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sessao, DadosIniciais, ORDEM_FASES } from '@/lib/types';
import { FormNovaSessao } from '@/components/FormNovaSessao';
import { Plus, Clock, ChevronRight, FlaskConical } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/sessoes')
      .then(r => r.json())
      .then(data => { setSessoes(data); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  const handleCriarSessao = async (dados: DadosIniciais) => {
    const res = await fetch('/api/sessoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const sessao: Sessao = await res.json();
    router.push(`/sessao/${sessao.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <FlaskConical size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-lg leading-none">PharmaHub</h1>
              <p className="text-xs text-gray-400 mt-0.5">Assistente Magistral</p>
            </div>
          </div>
          <button
            onClick={() => setMostrarForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus size={16} />
            Nova sessão
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-10">
        {!carregando && sessoes.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FlaskConical size={28} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Bem-vindo ao PharmaHub</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              Desenvolva fórmulas magistrais com assistência de IA especializada em 9 fases:
              ativos, formulação, validação, ficha técnica, rótulo, treinamento e comercialização.
            </p>
            <button
              onClick={() => setMostrarForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all"
            >
              <Plus size={17} />
              Criar primeira sessão
            </button>
          </div>
        )}

        {sessoes.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-5">
              Sessões recentes
            </h2>
            <div className="space-y-3">
              {sessoes.map(sessao => {
                const fasesCompletas = ORDEM_FASES.filter(f => sessao.outputs[`fase${f}`]).length;
                const progresso = Math.round((fasesCompletas / ORDEM_FASES.length) * 100);
                return (
                  <button
                    key={sessao.id}
                    onClick={() => router.push(`/sessao/${sessao.id}`)}
                    className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 text-left hover:border-blue-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-800 truncate">
                            {sessao.dadosIniciais.nomeProjeto}
                          </h3>
                          {fasesCompletas > 0 && (
                            <span className="shrink-0 text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                              {fasesCompletas} fase{fasesCompletas !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{sessao.dadosIniciais.indicacaoClinica}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400 rounded-full transition-all"
                              style={{ width: `${progresso}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-300 shrink-0">{progresso}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-5 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-gray-300">
                          <Clock size={11} />
                          {new Date(sessao.atualizadaEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </div>
                        <ChevronRight size={16} className="text-gray-200 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {mostrarForm && (
        <FormNovaSessao
          onCriar={handleCriarSessao}
          onCancelar={() => setMostrarForm(false)}
        />
      )}
    </div>
  );
}
