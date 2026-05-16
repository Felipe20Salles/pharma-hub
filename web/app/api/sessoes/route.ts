import { listarSessoes, salvarSessao } from '@/lib/storage';
import { DadosIniciais, Sessao } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessoes = await listarSessoes();
    return Response.json(sessoes);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const dadosIniciais: DadosIniciais = await req.json();
    const sessao: Sessao = {
      id: crypto.randomUUID(),
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
      faseAtual: 1,
      dadosIniciais,
      outputs: {},
      historico: {},
    };
    await salvarSessao(sessao);
    return Response.json(sessao);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    return Response.json({ error: msg }, { status: 500 });
  }
}
