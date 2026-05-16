import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Sessao } from './types';

const DIR = path.join(process.cwd(), '..', 'sessoes');

async function garantirDir() {
  await fs.mkdir(DIR, { recursive: true });
}

export async function salvarSessao(sessao: Sessao): Promise<void> {
  await garantirDir();
  sessao.atualizadaEm = new Date().toISOString();
  await fs.writeFile(path.join(DIR, `${sessao.id}.json`), JSON.stringify(sessao, null, 2), 'utf-8');
}

export async function carregarSessao(id: string): Promise<Sessao | null> {
  const arquivo = path.join(DIR, `${id}.json`);
  try {
    const conteudo = await fs.readFile(arquivo, 'utf-8');
    return JSON.parse(conteudo) as Sessao;
  } catch {
    return null;
  }
}

export async function listarSessoes(): Promise<Sessao[]> {
  await garantirDir();
  const arquivos = (await fs.readdir(DIR)).filter(f => f.endsWith('.json'));
  const sessoes = await Promise.all(
    arquivos.map(async f => JSON.parse(await fs.readFile(path.join(DIR, f), 'utf-8')) as Sessao)
  );
  return sessoes.sort((a, b) => new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime());
}

export function exportarMarkdown(sessao: Sessao): string {
  const NOMES: Record<string, string> = {
    fase1:  '🔬 Exploração de Ativos e Fórmula',
    fase3:  '✅ Validação Final',
    fase4:  '📄 Ficha Técnica Oficial',
    fase5:  '🏷️ Rótulo',
    fase6:  '🎓 Scripts de Treinamento',
    fase7:  '📈 Funil e Posicionamento',
  };
  const linhas = [
    `# PharmaHub — ${sessao.dadosIniciais.nomeProjeto}`,
    `**Exportado em:** ${new Date().toLocaleString('pt-BR')}  |  **ID:** ${sessao.id}`,
    '', '---', '', '## Dados Iniciais', '',
    `- **Indicação:** ${sessao.dadosIniciais.indicacaoClinica}`,
    `- **Público-alvo:** ${sessao.dadosIniciais.publicoAlvo}`,
    `- **Forma Farmacêutica:** ${sessao.dadosIniciais.formaFarmaceutica}`,
    `- **Via:** ${sessao.dadosIniciais.viaAdministracao}`,
    `- **Ativos:** ${sessao.dadosIniciais.ativosConsiderados}`,
    `- **Restrições:** ${sessao.dadosIniciais.restricoes}`,
    `- **Médico:** ${sessao.dadosIniciais.medicoSolicitante}`,
    `- **Contexto:** ${sessao.dadosIniciais.contextoAdicional}`,
    '', '---', '',
  ];
  for (const chave of Object.keys(NOMES)) {
    const out = sessao.outputs[chave];
    if (out) { linhas.push(`## ${NOMES[chave]}`, '', out, '', '---', ''); }
  }
  return linhas.join('\n');
}
