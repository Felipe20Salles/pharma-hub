'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Sessao, FaseKey, ORDEM_FASES } from '@/lib/types';
import { FaseSidebar } from '@/components/FaseSidebar';
import { ChatArea } from '@/components/ChatArea';
import { BarraAcoes } from '@/components/BarraAcoes';
import { ArrowLeft, FlaskConical } from 'lucide-react';

export default function SessaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [faseAtiva, setFaseAtiva] = useState<FaseKey>('1');
  const [conteudoAtual, setConteudoAtual] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch(`/api/sessoes/${id}`)
      .then(r => r.json())
      .then((s: Sessao) => {
        setSessao(s);
        const ultimaFase = ORDEM_FASES.find(f => s.outputs[`fase${f}`]);
        if (ultimaFase) setFaseAtiva(ultimaFase);
      })
      .catch(() => setErro('Sessão não encontrada.'));
  }, [id]);

  useEffect(() => {
    if (sessao) {
      setConteudoAtual(sessao.outputs[`fase${faseAtiva}`] || '');
    }
  }, [faseAtiva, sessao]);

  const chamarAgente = useCallback(async (isAjuste: boolean, mensagem?: string) => {
    if (!sessao || carregando) return;
    setCarregando(true);
    setConteudoAtual('');
    setErro('');

    try {
      const res = await fetch('/api/agente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessaoId: id, faseKey: faseAtiva, mensagem, isAjuste }),
      });

      if (!res.ok || !res.body) throw new Error('Erro na requisição');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let texto = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        texto += decoder.decode(value, { stream: true });
        setConteudoAtual(texto);
      }

      // Recarrega sessão para sincronizar estado
      const sessaoAtualizada: Sessao = await fetch(`/api/sessoes/${id}`).then(r => r.json());
      setSessao(sessaoAtualizada);
    } catch (e) {
      setErro('Erro ao consultar agente. Verifique sua chave de API.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [sessao, carregando, id, faseAtiva]);

  const handleIniciar = () => chamarAgente(false);
  const handleAjuste = (texto: string) => chamarAgente(true, texto);

  const handleProximaFase = () => {
    const idx = ORDEM_FASES.indexOf(faseAtiva);
    if (idx < ORDEM_FASES.length - 1) {
      setFaseAtiva(ORDEM_FASES[idx + 1]);
    }
  };

  const handleExportar = () => {
    window.open(`/api/exportar?id=${id}`, '_blank');
  };

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>{erro}</p>
      </div>
    );
  }

  if (!sessao) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        <p>Carregando sessão...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Topbar */}
      <header className="border-b border-gray-100 px-5 py-3 flex items-center gap-4 bg-white shrink-0">
        <button
          onClick={() => router.push('/')}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
          <FlaskConical size={13} className="text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700">{sessao.dadosIniciais.nomeProjeto}</span>
        <span className="text-xs text-gray-300 hidden sm:block">·</span>
        <span className="text-xs text-gray-400 hidden sm:block truncate">{sessao.dadosIniciais.indicacaoClinica}</span>
      </header>

      {/* Layout principal */}
      <div className="flex-1 flex overflow-hidden">
        <FaseSidebar
          sessao={sessao}
          faseAtiva={faseAtiva}
          carregando={carregando}
          onSelectFase={f => { setFaseAtiva(f); }}
        />

        {/* Área direita */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea
            faseKey={faseAtiva}
            conteudo={conteudoAtual}
            carregando={carregando}
          />
          <BarraAcoes
            faseKey={faseAtiva}
            sessaoId={id}
            temConteudo={!!conteudoAtual}
            carregando={carregando}
            onIniciar={handleIniciar}
            onAjuste={handleAjuste}
            onProximaFase={handleProximaFase}
            onExportar={handleExportar}
          />
        </div>
      </div>
    </div>
  );
}
