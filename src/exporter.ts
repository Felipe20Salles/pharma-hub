import fs from 'fs';
import path from 'path';
import { Sessao } from './models/Sessao';

const NOMES_FASES: Record<string, string> = {
  fase1:  '🔬 Exploração de Ativos',
  fase1b: '🧪 Pesquisa Profunda de Ativo',
  fase2:  '⚗️ Montagem da Fórmula',
  fase2b: '📦 Substituição por Estoque',
  fase3:  '✅ Validação Final',
  fase4:  '📄 Ficha Técnica Oficial',
  fase5:  '🏷️ Rótulo',
  fase6:  '🎓 Scripts de Treinamento',
  fase7:  '📈 Funil e Posicionamento Comercial',
};

export function exportarSessao(sessao: Sessao): string {
  const dir = path.resolve(process.cwd(), 'exports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const data = new Date().toISOString().split('T')[0];
  const nomeArquivo = `${sessao.dadosIniciais.nomeProjeto.replace(/\s+/g, '_')}_${data}.md`;
  const caminho = path.join(dir, nomeArquivo);

  const linhas: string[] = [
    `# PharmaHub — ${sessao.dadosIniciais.nomeProjeto}`,
    '',
    `**Data de exportação:** ${new Date().toLocaleString('pt-BR')}`,
    `**Sessão ID:** ${sessao.id}`,
    '',
    '---',
    '',
    '## Dados Iniciais',
    '',
    `- **Indicação Clínica:** ${sessao.dadosIniciais.indicacaoClinica}`,
    `- **Público-alvo:** ${sessao.dadosIniciais.publicoAlvo}`,
    `- **Forma Farmacêutica:** ${sessao.dadosIniciais.formaFarmaceutica}`,
    `- **Via de Administração:** ${sessao.dadosIniciais.viaAdministracao}`,
    `- **Ativos Considerados:** ${sessao.dadosIniciais.ativosConsiderados}`,
    `- **Restrições:** ${sessao.dadosIniciais.restricoes}`,
    `- **Médico Solicitante:** ${sessao.dadosIniciais.medicoSolicitante}`,
    `- **Contexto Adicional:** ${sessao.dadosIniciais.contextoAdicional}`,
    '',
    '---',
    '',
  ];

  const ordemFases = ['fase1', 'fase1b', 'fase2', 'fase2b', 'fase3', 'fase4', 'fase5', 'fase6', 'fase7'];

  for (const chave of ordemFases) {
    const output = sessao.outputs[chave];
    if (output) {
      linhas.push(`## ${NOMES_FASES[chave] || chave}`);
      linhas.push('');
      linhas.push(output);
      linhas.push('');
      linhas.push('---');
      linhas.push('');
    }
  }

  fs.writeFileSync(caminho, linhas.join('\n'), 'utf-8');
  return caminho;
}
