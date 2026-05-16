import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';

import { ANTHROPIC_API_KEY, CLAUDE_MODEL } from './config';
import { Sessao, DadosIniciais } from './models/Sessao';
import { salvarSessao, carregarUltimaSessao, listarSessoes } from './storage';
import { exportarSessao } from './exporter';

import { Phase1Agent } from './agents/Phase1Agent';
import { Phase1BAgent } from './agents/Phase1BAgent';
import { Phase2Agent } from './agents/Phase2Agent';
import { Phase2BAgent } from './agents/Phase2BAgent';
import { Phase3Agent } from './agents/Phase3Agent';
import { Phase4Agent } from './agents/Phase4Agent';
import { Phase5Agent } from './agents/Phase5Agent';
import { Phase6Agent } from './agents/Phase6Agent';
import { Phase7Agent } from './agents/Phase7Agent';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

type FaseKey = '1' | '1b' | '2' | '2b' | '3' | '4' | '5' | '6' | '7';

const FASES: Record<FaseKey, { nome: string; agente: string }> = {
  '1':  { nome: '🔬 Exploração de Ativos',        agente: 'Phase1Agent'  },
  '1b': { nome: '🧪 Pesquisa Profunda de Ativo',   agente: 'Phase1BAgent' },
  '2':  { nome: '⚗️  Montagem da Fórmula',          agente: 'Phase2Agent'  },
  '2b': { nome: '📦 Substituição por Estoque',      agente: 'Phase2BAgent' },
  '3':  { nome: '✅ Validação Final',               agente: 'Phase3Agent'  },
  '4':  { nome: '📄 Ficha Técnica Oficial',         agente: 'Phase4Agent'  },
  '5':  { nome: '🏷️  Rótulo',                       agente: 'Phase5Agent'  },
  '6':  { nome: '🎓 Scripts de Treinamento',        agente: 'Phase6Agent'  },
  '7':  { nome: '📈 Funil e Posicionamento',        agente: 'Phase7Agent'  },
};

const CORES_FASES: Record<FaseKey, chalk.Chalk> = {
  '1':  chalk.magenta,
  '1b': chalk.magentaBright,
  '2':  chalk.blue,
  '2b': chalk.blueBright,
  '3':  chalk.green,
  '4':  chalk.greenBright,
  '5':  chalk.yellow,
  '6':  chalk.cyan,
  '7':  chalk.red,
};

function criarAgente(faseKey: FaseKey) {
  switch (faseKey) {
    case '1':  return new Phase1Agent(client, CLAUDE_MODEL);
    case '1b': return new Phase1BAgent(client, CLAUDE_MODEL);
    case '2':  return new Phase2Agent(client, CLAUDE_MODEL);
    case '2b': return new Phase2BAgent(client, CLAUDE_MODEL);
    case '3':  return new Phase3Agent(client, CLAUDE_MODEL);
    case '4':  return new Phase4Agent(client, CLAUDE_MODEL);
    case '5':  return new Phase5Agent(client, CLAUDE_MODEL);
    case '6':  return new Phase6Agent(client, CLAUDE_MODEL);
    case '7':  return new Phase7Agent(client, CLAUDE_MODEL);
  }
}

function exibirCabecalho(faseKey: FaseKey) {
  const cor = CORES_FASES[faseKey];
  const nome = FASES[faseKey].nome;
  const largura = 44;
  const titulo = `  ${nome}`;
  const pad = ' '.repeat(Math.max(0, largura - titulo.length - 2));
  console.log('\n' + cor('╔' + '═'.repeat(largura) + '╗'));
  console.log(cor('║') + titulo + pad + cor('  ║'));
  console.log(cor('╚' + '═'.repeat(largura) + '╝') + '\n');
}

function montarContextoInicial(sessao: Sessao, faseKey: FaseKey): string {
  const dados = JSON.stringify(sessao.dadosIniciais, null, 2);
  const base = `Dados do projeto:\n${dados}\n`;

  switch (faseKey) {
    case '1':
      return `${base}\nExplore os melhores ativos funcionais para este projeto. Compare opções e sugira a combinação mais eficaz.`;
    case '1b':
      return `${base}\nRealize uma pesquisa aprofundada sobre os ativos mencionados no projeto.`;
    case '2':
      return `${base}\nContexto fase 1:\n${sessao.outputs['fase1'] || 'Não disponível'}\n\nMonte e refine a fórmula para este projeto.`;
    case '2b':
      return `${base}\nFórmula atual:\n${sessao.outputs['fase2'] || sessao.outputs['fase1'] || 'Não definida'}\n\nSugira substituições para ativos indisponíveis em estoque.`;
    case '3':
      return `${base}\nFórmula desenvolvida:\n${sessao.outputs['fase2'] || sessao.outputs['fase1'] || 'Não definida ainda'}\n\nRealize a validação técnica completa desta fórmula.`;
    case '4':
      return `${base}\nFórmula validada:\n${sessao.outputs['fase3'] || sessao.outputs['fase2'] || sessao.outputs['fase1'] || 'Não definida'}\n\nGere a ficha técnica oficial completa.`;
    case '5':
      return `${base}\nFicha técnica:\n${sessao.outputs['fase4'] || 'Não disponível'}\n\nGere o texto completo do rótulo conforme RDC 67/2007.`;
    case '6':
      return `${base}\nFicha técnica:\n${sessao.outputs['fase4'] || 'Não disponível'}\n\nGere os scripts de treinamento nas três versões (balconista, médico, paciente).`;
    case '7':
      return `${base}\nFicha técnica:\n${sessao.outputs['fase4'] || 'Não disponível'}\n\nGere a estratégia completa de funil e posicionamento comercial.`;
    default:
      return base;
  }
}

function chaveOutput(faseKey: FaseKey): string {
  return `fase${faseKey}`;
}

async function coletarDadosIniciais(): Promise<DadosIniciais> {
  console.log(chalk.bold.cyan('\n📋 Vamos coletar os dados do projeto.\n'));

  const respostas = await inquirer.prompt([
    { type: 'input', name: 'nomeProjeto',        message: 'Nome do projeto / produto:',         validate: (v: string) => v.trim() !== '' || 'Campo obrigatório' },
    { type: 'input', name: 'indicacaoClinica',   message: 'Indicação clínica:',                  validate: (v: string) => v.trim() !== '' || 'Campo obrigatório' },
    { type: 'input', name: 'publicoAlvo',        message: 'Público-alvo:',                       validate: (v: string) => v.trim() !== '' || 'Campo obrigatório' },
    { type: 'input', name: 'formaFarmaceutica',  message: 'Forma farmacêutica:',                 validate: (v: string) => v.trim() !== '' || 'Campo obrigatório' },
    { type: 'input', name: 'viaAdministracao',   message: 'Via de administração:',               validate: (v: string) => v.trim() !== '' || 'Campo obrigatório' },
    { type: 'input', name: 'ativosConsiderados', message: 'Ativos considerados (separados por vírgula):', default: '' },
    { type: 'input', name: 'restricoes',         message: 'Restrições ou contraindicações:',    default: 'Nenhuma' },
    { type: 'input', name: 'medicoSolicitante',  message: 'Médico solicitante (se houver):',    default: '' },
    { type: 'input', name: 'contextoAdicional',  message: 'Contexto adicional:',                default: '' },
  ]);

  return respostas as DadosIniciais;
}

async function exibirResumo(sessao: Sessao) {
  console.log(chalk.bold.white('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.white(`📁 SESSÃO: ${sessao.dadosIniciais.nomeProjeto}`));
  console.log(chalk.bold.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.gray(`ID: ${sessao.id}`));
  console.log(chalk.gray(`Criada em: ${new Date(sessao.criadaEm).toLocaleString('pt-BR')}`));
  console.log(chalk.gray(`Atualizada: ${new Date(sessao.atualizadaEm).toLocaleString('pt-BR')}`));
  console.log('');
  console.log(chalk.bold('Indicação:'), sessao.dadosIniciais.indicacaoClinica);
  console.log(chalk.bold('Forma:'), sessao.dadosIniciais.formaFarmaceutica);
  console.log(chalk.bold('Via:'), sessao.dadosIniciais.viaAdministracao);
  console.log('');

  const fasesCompletas = Object.keys(sessao.outputs);
  if (fasesCompletas.length > 0) {
    console.log(chalk.bold('Fases concluídas:'));
    fasesCompletas.forEach(f => {
      const key = f.replace('fase', '') as FaseKey;
      const fase = FASES[key];
      if (fase) console.log(chalk.green(`  ✓ ${fase.nome}`));
    });
  } else {
    console.log(chalk.gray('Nenhuma fase concluída ainda.'));
  }
  console.log('');
}

async function menuPrincipal(sessao: Sessao, faseAtual: FaseKey): Promise<void> {
  const agente = criarAgente(faseAtual);

  if (sessao.historico[`fase${faseAtual}`]) {
    agente.carregarHistorico(sessao.historico[`fase${faseAtual}`]);
  }

  let primeiraVez = !sessao.outputs[chaveOutput(faseAtual)];

  exibirCabecalho(faseAtual);

  const cor = CORES_FASES[faseAtual];
  let ultimaResposta = '';

  if (primeiraVez) {
    const mensagem = montarContextoInicial(sessao, faseAtual);
    const spinner = ora({ text: chalk.gray('Consultando agente farmacêutico...'), color: 'cyan' }).start();

    try {
      ultimaResposta = await agente.chamar(mensagem);
      spinner.succeed(chalk.green('Resposta recebida'));
    } catch (err) {
      spinner.fail(chalk.red('Erro ao consultar agente'));
      throw err;
    }

    console.log('\n' + cor(ultimaResposta) + '\n');
    sessao.outputs[chaveOutput(faseAtual)] = ultimaResposta;
    sessao.historico[`fase${faseAtual}`] = agente.getHistorico();
    salvarSessao(sessao);
    primeiraVez = false;
  } else {
    ultimaResposta = sessao.outputs[chaveOutput(faseAtual)] || '';
    console.log(cor(ultimaResposta) + '\n');
  }

  let continuar = true;
  while (continuar) {
    const { acao } = await inquirer.prompt([{
      type: 'list',
      name: 'acao',
      message: chalk.bold.white('✅ Pronto. O que deseja fazer?'),
      choices: [
        { name: '💬 Pedir ajuste (continuar nesta fase)',  value: 'ajuste'   },
        { name: '▶️  Avançar para a próxima fase',          value: 'proxima'  },
        { name: '🗺️  Ir para uma fase específica',          value: 'especifica'},
        { name: '📋 Ver resumo da sessão',                  value: 'resumo'   },
        { name: '📤 Exportar sessão como Markdown',         value: 'exportar' },
        { name: '💾 Salvar e sair',                         value: 'sair'     },
      ],
    }]);

    switch (acao) {
      case 'ajuste': {
        const { ajuste } = await inquirer.prompt([{
          type: 'input',
          name: 'ajuste',
          message: '💬 O que deseja ajustar?',
          validate: (v: string) => v.trim() !== '' || 'Digite o ajuste desejado',
        }]);

        const spinner = ora({ text: chalk.gray('Consultando agente farmacêutico...'), color: 'cyan' }).start();
        try {
          ultimaResposta = await agente.iterar(ajuste);
          spinner.succeed(chalk.green('Resposta recebida'));
        } catch (err) {
          spinner.fail(chalk.red('Erro ao consultar agente'));
          throw err;
        }

        exibirCabecalho(faseAtual);
        console.log('\n' + cor(ultimaResposta) + '\n');
        sessao.outputs[chaveOutput(faseAtual)] = ultimaResposta;
        sessao.historico[`fase${faseAtual}`] = agente.getHistorico();
        salvarSessao(sessao);
        break;
      }

      case 'proxima': {
        const ordemFases: FaseKey[] = ['1', '1b', '2', '2b', '3', '4', '5', '6', '7'];
        const idx = ordemFases.indexOf(faseAtual);
        if (idx < ordemFases.length - 1) {
          faseAtual = ordemFases[idx + 1];
          continuar = false;
          await menuPrincipal(sessao, faseAtual);
        } else {
          console.log(chalk.bold.green('\n🎉 Todas as fases foram concluídas!\n'));
          continuar = false;
        }
        break;
      }

      case 'especifica': {
        const escolhas = Object.entries(FASES).map(([key, val]) => ({
          name: val.nome,
          value: key as FaseKey,
        }));
        const { fase } = await inquirer.prompt([{
          type: 'list',
          name: 'fase',
          message: 'Escolha a fase:',
          choices: escolhas,
        }]);
        continuar = false;
        await menuPrincipal(sessao, fase as FaseKey);
        break;
      }

      case 'resumo':
        await exibirResumo(sessao);
        break;

      case 'exportar': {
        const caminho = exportarSessao(sessao);
        console.log(chalk.green(`\n✅ Sessão exportada: ${caminho}\n`));
        break;
      }

      case 'sair':
        salvarSessao(sessao);
        console.log(chalk.bold.green(`\n💾 Sessão salva: sessoes/${sessao.id}.json\n`));
        continuar = false;
        process.exit(0);
    }
  }
}

export async function iniciarNovaSessao(): Promise<void> {
  const dadosIniciais = await coletarDadosIniciais();

  const sessao: Sessao = {
    id: uuidv4(),
    criadaEm: new Date().toISOString(),
    atualizadaEm: new Date().toISOString(),
    faseAtual: 1,
    dadosIniciais,
    outputs: {},
    historico: {},
  };

  salvarSessao(sessao);

  const escolhas = Object.entries(FASES).map(([key, val]) => ({
    name: val.nome,
    value: key as FaseKey,
  }));

  const { faseInicial } = await inquirer.prompt([{
    type: 'list',
    name: 'faseInicial',
    message: 'Por qual fase deseja começar?',
    choices: escolhas,
    default: '1',
  }]);

  await menuPrincipal(sessao, faseInicial as FaseKey);
}

export async function retomaSessao(): Promise<void> {
  const sessoes = listarSessoes();
  if (sessoes.length === 0) {
    console.log(chalk.yellow('\nNenhuma sessão salva encontrada.\n'));
    return;
  }

  const { sessaoId } = await inquirer.prompt([{
    type: 'list',
    name: 'sessaoId',
    message: 'Escolha a sessão para retomar:',
    choices: sessoes.map(s => ({
      name: `${s.dadosIniciais.nomeProjeto} — ${new Date(s.atualizadaEm).toLocaleString('pt-BR')}`,
      value: s.id,
    })),
  }]);

  const sessao = sessoes.find(s => s.id === sessaoId)!;

  const { faseRetomada } = await inquirer.prompt([{
    type: 'list',
    name: 'faseRetomada',
    message: 'Em qual fase deseja continuar?',
    choices: Object.entries(FASES).map(([key, val]) => ({
      name: `${val.nome}${sessao.outputs[`fase${key}`] ? chalk.green(' ✓') : ''}`,
      value: key as FaseKey,
    })),
  }]);

  await menuPrincipal(sessao, faseRetomada as FaseKey);
}
