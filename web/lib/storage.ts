import fs from 'fs';
import path from 'path';
import { Sessao } from './types';

const DIR = path.resolve(process.cwd(), '..', 'sessoes');

function garantirDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
}

export function salvarSessao(sessao: Sessao): void {
  garantirDir();
  sessao.atualizadaEm = new Date().toISOString();
  fs.writeFileSync(path.join(DIR, `${sessao.id}.json`), JSON.stringify(sessao, null, 2), 'utf-8');
}

export function carregarSessao(id: string): Sessao | null {
  const arquivo = path.join(DIR, `${id}.json`);
  if (!fs.existsSync(arquivo)) return null;
  return JSON.parse(fs.readFileSync(arquivo, 'utf-8')) as Sessao;
}

export function listarSessoes(): Sessao[] {
  garantirDir();
  const arquivos = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
  return arquivos
    .map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8')) as Sessao)
    .sort((a, b) => new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime());
}

export function exportarMarkdown(sessao: Sessao): string {
  const NOMES: Record<string, string> = {
    fase1: '🔬 Exploração de Ativos', fase1b: '🧪 Pesquisa Profunda',
    fase2: '⚗️ Montagem da Fórmula',  fase2b: '📦 Substituição por Estoque',
    fase3: '✅ Validação Final',       fase4: '📄 Ficha Técnica Oficial',
    fase5: '🏷️ Rótulo',               fase6: '🎓 Scripts de Treinamento',
    fase7: '📈 Funil e Posicionamento',
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
