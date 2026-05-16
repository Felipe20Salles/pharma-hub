export interface DadosIniciais {
  nomeProjeto: string;
  indicacaoClinica: string;
  publicoAlvo: string;
  formaFarmaceutica: string;
  viaAdministracao: string;
  ativosConsiderados: string;
  restricoes: string;
  medicoSolicitante: string;
  contextoAdicional: string;
}

export interface Sessao {
  id: string;
  criadaEm: string;
  atualizadaEm: string;
  faseAtual: number;
  dadosIniciais: DadosIniciais;
  outputs: Partial<Record<string, string>>;
  historico: Record<string, Array<{ role: string; content: string }>>;
}

export type FaseKey = '1' | '1b' | '2' | '2b' | '3' | '4' | '5' | '6' | '7';

export interface FaseInfo {
  nome: string;
  nomeCompleto: string;
  agente: string;
  cor: string;
}

export const FASES: Record<FaseKey, FaseInfo> = {
  '1':  { nome: 'Exploração de Ativos',       nomeCompleto: '🔬 Exploração de Ativos',       agente: 'Phase1Agent',  cor: 'violet'  },
  '1b': { nome: 'Pesquisa Profunda',           nomeCompleto: '🧪 Pesquisa Profunda de Ativo',  agente: 'Phase1BAgent', cor: 'purple'  },
  '2':  { nome: 'Montagem da Fórmula',         nomeCompleto: '⚗️ Montagem da Fórmula',         agente: 'Phase2Agent',  cor: 'blue'    },
  '2b': { nome: 'Substituição por Estoque',    nomeCompleto: '📦 Substituição por Estoque',    agente: 'Phase2BAgent', cor: 'sky'     },
  '3':  { nome: 'Validação Final',             nomeCompleto: '✅ Validação Final',              agente: 'Phase3Agent',  cor: 'green'   },
  '4':  { nome: 'Ficha Técnica',               nomeCompleto: '📄 Ficha Técnica Oficial',        agente: 'Phase4Agent',  cor: 'emerald' },
  '5':  { nome: 'Rótulo',                      nomeCompleto: '🏷️ Rótulo',                       agente: 'Phase5Agent',  cor: 'amber'   },
  '6':  { nome: 'Scripts de Treinamento',      nomeCompleto: '🎓 Scripts de Treinamento',       agente: 'Phase6Agent',  cor: 'cyan'    },
  '7':  { nome: 'Funil Comercial',             nomeCompleto: '📈 Funil e Posicionamento',       agente: 'Phase7Agent',  cor: 'rose'    },
};

export const ORDEM_FASES: FaseKey[] = ['1', '1b', '2', '2b', '3', '4', '5', '6', '7'];
