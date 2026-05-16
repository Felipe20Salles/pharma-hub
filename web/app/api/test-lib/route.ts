import { listarSessoes } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessoes = await listarSessoes();
    return Response.json({ ok: true, total: sessoes.length });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
