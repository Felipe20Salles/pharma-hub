import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from './BaseAgent';

const SYSTEM_PROMPT = `Você é um especialista em marketing farmacêutico e estratégia de vendas para farmácias de manipulação.
Gere estratégias completas de: abordagem inicial ao médico (como apresentar, argumentos técnicos, material sugerido),
jornada do paciente (primeiro contato, experiência na retirada, acompanhamento D+15),
retenção e recompra (mensagem WhatsApp D+25, combo ou produto complementar, fidelização).
Se o nome do produto ainda não estiver definido, sugira 3 opções com justificativa e slogan.
Responda sempre em português brasileiro.`;

export class Phase7Agent extends BaseAgent {
  constructor(client: Anthropic, model: string) {
    super(client, model, SYSTEM_PROMPT);
  }
}
