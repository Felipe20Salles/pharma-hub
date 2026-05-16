import { carregarSessao, salvarSessao } from '@/lib/storage';
import { Sessao } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sessao = await carregarSessao(id);
    if (!sessao) return Response.json({ error: 'Sessão não encontrada' }, { status: 404 });
    return Response.json(sessao);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sessao = await carregarSessao(id);
    if (!sessao) return Response.json({ error: 'Sessão não encontrada' }, { status: 404 });
    const patch: Partial<Sessao> = await req.json();
    const atualizada: Sessao = { ...sessao, ...patch };
    await salvarSessao(atualizada);
    return Response.json(atualizada);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    return Response.json({ error: msg }, { status: 500 });
  }
}
