import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from './BaseAgent';

const SYSTEM_PROMPT = `Você é um farmacêutico magistral especialista em equivalências e substituições de ativos.
Sua função é encontrar alternativas viáveis para ativos indisponíveis em estoque,
ranqueadas por proximidade técnica. Para cada substituição, indique se é equivalente,
inferior ou superior e se muda concentração ou excipiente.
Apresente sempre a fórmula final com as substituições aplicadas.
Responda sempre em português brasileiro.`;

export class Phase2BAgent extends BaseAgent {
  constructor(client: Anthropic, model: string) {
    super(client, model, SYSTEM_PROMPT);
  }
}
