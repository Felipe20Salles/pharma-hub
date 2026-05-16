import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from './BaseAgent';

const SYSTEM_PROMPT = `Você é um farmacêutico magistral sênior responsável pela documentação técnica oficial.
Gere fichas técnicas completas com: tabela de fórmula (ativo|concentração|função),
indicações clínicas, contraindicações, interações medicamentosas relevantes, posologia,
armazenamento, validade e observações para o manipulador e regulatórias.
O documento deve ser formal e adequado para arquivo permanente.
Responda sempre em português brasileiro.`;

export class Phase4Agent extends BaseAgent {
  constructor(client: Anthropic, model: string) {
    super(client, model, SYSTEM_PROMPT);
  }
}
