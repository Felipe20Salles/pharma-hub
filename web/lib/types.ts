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
  formulaConfirmada?: boolean;
}

export type FaseKey = '1' | '3' | '4' | '5' | '6' | '7';

export interface FaseInfo {
  nome: string;
  nomeCompleto: string;
  descricao: string;
  agente: string;
  cor: string;
}

export const FASES: Record<FaseKey, FaseInfo> = {
  '1': { nome: 'Exploração e Fórmula',    nomeCompleto: 'Exploração de Ativos e Fórmula', descricao: 'Ativos, incompatibilidades e fórmula final',  agente: 'Phase1Agent',  cor: 'violet'  },
  '3': { nome: 'Validação Final',          nomeCompleto: 'Validação Final',                descricao: 'Validação técnica e parecer regulatório',      agente: 'Phase3Agent',  cor: 'green'   },
  '4': { nome: 'Ficha Técnica',            nomeCompleto: 'Ficha Técnica Oficial',           descricao: 'Documentação técnica para arquivo permanente', agente: 'Phase4Agent',  cor: 'emerald' },
  '5': { nome: 'Rótulo',                   nomeCompleto: 'Rótulo',                          descricao: 'Texto de rótulo conforme RDC 67/2007',         agente: 'Phase5Agent',  cor: 'amber'   },
  '6': { nome: 'Scripts de Treinamento',   nomeCompleto: 'Scripts de Treinamento',          descricao: 'Balconista, médico prescritor e paciente',     agente: 'Phase6Agent',  cor: 'cyan'    },
  '7': { nome: 'Funil Comercial',          nomeCompleto: 'Funil e Posicionamento',          descricao: 'Estratégia de vendas e jornada do paciente',   agente: 'Phase7Agent',  cor: 'rose'    },
};

export const ORDEM_FASES: FaseKey[] = ['1', '3', '4', '5', '6', '7'];
