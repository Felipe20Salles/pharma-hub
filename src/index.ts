import inquirer from 'inquirer';
import chalk from 'chalk';
import { iniciarNovaSessao, retomaSessao } from './orchestrator';
import { listarSessoes } from './storage';

function exibirBanner() {
  const linha = '═'.repeat(50);
  console.log('\n' + chalk.bold.cyan('╔' + linha + '╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('        💊  PharmaHub — Assistente Magistral       ') + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('║') + chalk.gray('     Sistema multi-agente para farmácias magistrais  ') + chalk.bold.cyan('║'));
  console.log(chalk.bold.cyan('╚' + linha + '╝') + '\n');
}

async function menuInicial(): Promise<void> {
  exibirBanner();

  const { opcao } = await inquirer.prompt([{
    type: 'list',
    name: 'opcao',
    message: chalk.bold('O que deseja fazer?'),
    choices: [
      { name: '🆕 Nova sessão',              value: 'nova'    },
      { name: '🔄 Retomar sessão salva',      value: 'retomar' },
      { name: '📋 Listar sessões anteriores', value: 'listar'  },
      { name: '🚪 Sair',                      value: 'sair'    },
    ],
  }]);

  switch (opcao) {
    case 'nova':
      await iniciarNovaSessao();
      break;

    case 'retomar':
      await retomaSessao();
      break;

    case 'listar': {
      const sessoes = listarSessoes();
      if (sessoes.length === 0) {
        console.log(chalk.yellow('\nNenhuma sessão encontrada.\n'));
      } else {
        console.log(chalk.bold('\n📋 Sessões salvas:\n'));
        sessoes.forEach((s, i) => {
          const fases = Object.keys(s.outputs).length;
          console.log(
            chalk.white(`${i + 1}. `) +
            chalk.bold(s.dadosIniciais.nomeProjeto) +
            chalk.gray(` — ${new Date(s.atualizadaEm).toLocaleString('pt-BR')}`) +
            chalk.green(` [${fases} fase(s) concluída(s)]`)
          );
        });
        console.log('');
      }
      await menuInicial();
      break;
    }

    case 'sair':
      console.log(chalk.bold.cyan('\nAté logo! 👋\n'));
      process.exit(0);
  }
}

menuInicial().catch(err => {
  console.error(chalk.red('\n❌ Erro fatal:'), err.message);
  process.exit(1);
});
