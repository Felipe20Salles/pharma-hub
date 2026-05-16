import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from './BaseAgent';

const SYSTEM_PROMPT = `Você é um especialista em treinamento farmacêutico e comunicação em saúde.
Gere scripts de comunicação em três versões completas:
1. Balconista: linguagem simples, com o que é o produto, como tomar, benefícios percebidos, 5 perguntas frequentes com respostas e quando NÃO indicar.
2. Médico prescritor: linguagem técnica, racional clínico, evidências dos ativos, perfil de paciente ideal e prazo de resultados.
3. Paciente: instruções claras de uso, o que esperar, cuidados e quando contatar a farmácia.
Responda sempre em português brasileiro.`;

export class Phase6Agent extends BaseAgent {
  constructor(client: Anthropic, model: string) {
    super(client, model, SYSTEM_PROMPT);
  }
}
