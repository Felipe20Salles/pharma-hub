import Anthropic from '@anthropic-ai/sdk';

export class BaseAgent {
  protected client: Anthropic;
  protected model: string;
  protected systemPrompt: string;
  protected historico: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor(client: Anthropic, model: string, systemPrompt: string) {
    this.client = client;
    this.model = model;
    this.systemPrompt = systemPrompt;
  }

  async chamar(mensagem: string): Promise<string> {
    this.historico.push({ role: 'user', content: mensagem });

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: this.systemPrompt,
      messages: this.historico,
    });

    const resposta = (response.content[0] as { type: string; text: string }).text;
    this.historico.push({ role: 'assistant', content: resposta });
    return resposta;
  }

  async iterar(ajuste: string): Promise<string> {
    return this.chamar(ajuste);
  }

  carregarHistorico(historico: Array<{ role: string; content: string }>) {
    this.historico = historico as Array<{ role: 'user' | 'assistant'; content: string }>;
  }

  getHistorico() {
    return this.historico;
  }

  resetar() {
    this.historico = [];
  }
}
