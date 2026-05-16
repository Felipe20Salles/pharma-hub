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
