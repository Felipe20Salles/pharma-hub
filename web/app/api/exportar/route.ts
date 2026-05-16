import { carregarSessao } from '@/lib/storage';
import { exportarMarkdown } from '@/lib/storage';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return new Response('ID obrigatório', { status: 400 });

  const sessao = carregarSessao(id);
  if (!sessao) return new Response('Sessão não encontrada', { status: 404 });

  const md = exportarMarkdown(sessao);
  const nome = `${sessao.dadosIniciais.nomeProjeto.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;

  return new Response(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nome}"`,
    },
  });
}
