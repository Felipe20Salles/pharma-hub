import { carregarSessao, salvarSessao } from '@/lib/storage';
import { chamarAgenteStream, montarContextoInicial } from '@/lib/agents';
import { FaseKey } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { sessaoId, faseKey, mensagem, isAjuste } = await req.json() as {
    sessaoId: string;
    faseKey: FaseKey;
    mensagem?: string;
    isAjuste?: boolean;
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.CLAUDE_MODEL || 'claude-opus-4-5';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY não configurada' }), { status: 500 });
  }

  const sessao = carregarSessao(sessaoId);
  if (!sessao) {
    return new Response(JSON.stringify({ error: 'Sessão não encontrada' }), { status: 404 });
  }

  const chaveHistorico = `fase${faseKey}`;
  const historico = (sessao.historico[chaveHistorico] || []) as Array<{ role: 'user' | 'assistant'; content: string }>;
  const msg = isAjuste && mensagem ? mensagem : montarContextoInicial(sessao, faseKey);

  const encoder = new TextEncoder();
  let respostaCompleta = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of chamarAgenteStream(faseKey, historico, msg, apiKey, model)) {
          respostaCompleta += chunk;
          controller.enqueue(encoder.encode(chunk));
        }

        const novoHistorico = [
          ...historico,
          { role: 'user' as const, content: msg },
          { role: 'assistant' as const, content: respostaCompleta },
        ];
        sessao.historico[chaveHistorico] = novoHistorico;
        sessao.outputs[`fase${faseKey}`] = respostaCompleta;
        salvarSessao(sessao);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido';
        controller.enqueue(encoder.encode(`\n\n❌ Erro: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}
