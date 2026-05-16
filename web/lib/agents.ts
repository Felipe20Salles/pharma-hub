import Anthropic from '@anthropic-ai/sdk';
import { FaseKey, Sessao } from './types';

const SYSTEM_PROMPTS: Record<FaseKey, string> = {
  '1': `Você é um farmacêutico magistral sênior especialista em desenvolvimento de fórmulas magistrais.
Sua função nesta fase é conduzir TODO o processo de formulação em etapas sequenciais:

1. EXPLORAÇÃO DE ATIVOS: Explore e compare opções de ativos para a indicação clínica. Para cada ativo, apresente: nome técnico, classe funcional, mecanismo de ação, concentração usual (mín-máx), nível de evidência (Forte/Moderada/Limitada/Empírica), solubilidade, incompatibilidades e necessidade de receita.

2. SELEÇÃO E JUSTIFICATIVA: Selecione os melhores ativos com base em evidências, compatibilidade e viabilidade magistral. Justifique cada escolha e descarte.

3. ANÁLISE DE INCOMPATIBILIDADES: Verifique compatibilidade entre os ativos selecionados, excipientes adequados e forma farmacêutica.

4. FÓRMULA FINAL: Apresente obrigatoriamente uma tabela com a fórmula completa no seguinte formato:
   | Ativo/Excipiente | Concentração | Função |
   E inclua: posologia recomendada, via de administração, forma farmacêutica, condições de armazenamento e validade estimada.

Esta fórmula final será usada em todas as etapas subsequentes e não poderá ser alterada exceto se a validação técnica identificar problemas.
Responda sempre em português brasileiro com seções bem delimitadas usando ## para títulos.`,

  '3': `Você é um farmacêutico magistral sênior fazendo validação técnica rigorosa de fórmulas.
Avalie: compatibilidade entre ativos, adequação de concentrações, viabilidade da forma
farmacêutica (volume, tamanho de cápsula), excipiente recomendado, condições de armazenamento,
validade estimada, pontos de atenção na manipulação e alertas regulatórios (ANVISA/RDC 67).
Emita sempre um parecer final claro: APROVADA / APROVADA COM RESSALVAS / REQUER AJUSTE.
Responda sempre em português brasileiro.`,

  '4': `Você é um farmacêutico magistral sênior responsável pela documentação técnica oficial.
Gere fichas técnicas completas com: tabela de fórmula (ativo|concentração|função),
indicações clínicas, contraindicações, interações medicamentosas relevantes, posologia,
armazenamento, validade e observações para o manipulador e regulatórias.
O documento deve ser formal e adequado para arquivo permanente.
Responda sempre em português brasileiro.`,

  '5': `Você é um farmacêutico magistral especialista em rotulagem conforme RDC 67/2007.
Gere textos completos de rótulo com todos os campos obrigatórios: nome do produto,
composição completa (ativos + excipientes), posologia, via de administração, advertências,
condições de conservação, validade (campo em branco), espaços para nome do paciente,
data de manipulação, número da receita e dados da farmácia.
Indique também embalagem recomendada e tipo de frasco/blister adequado.
Responda sempre em português brasileiro.`,

  '6': `Você é um especialista em treinamento farmacêutico e comunicação em saúde.
Gere scripts de comunicação em três versões completas:
1. Balconista: linguagem simples, com o que é o produto, como tomar, benefícios percebidos, 5 perguntas frequentes com respostas e quando NÃO indicar.
2. Médico prescritor: linguagem técnica, racional clínico, evidências dos ativos, perfil de paciente ideal e prazo de resultados.
3. Paciente: instruções claras de uso, o que esperar, cuidados e quando contatar a farmácia.
Responda sempre em português brasileiro.`,

  '7': `Você é um especialista em marketing farmacêutico e estratégia de vendas para farmácias de manipulação.
Gere estratégias completas de: abordagem inicial ao médico (como apresentar, argumentos técnicos, material sugerido),
jornada do paciente (primeiro contato, experiência na retirada, acompanhamento D+15),
retenção e recompra (mensagem WhatsApp D+25, combo ou produto complementar, fidelização).
Se o nome do produto ainda não estiver definido, sugira 3 opções com justificativa e slogan.
Responda sempre em português brasileiro.`,
};

export function montarContextoInicial(sessao: Sessao, faseKey: FaseKey): string {
  const dados = JSON.stringify(sessao.dadosIniciais, null, 2);
  const base = `Dados do projeto:\n${dados}\n`;
  const f1 = sessao.outputs['fase1'] || 'Não disponível';
  const f3 = sessao.outputs['fase3'] || f1;
  const f4 = sessao.outputs['fase4'] || 'Não disponível';

  const instrucoes: Record<FaseKey, string> = {
    '1': `${base}\nExplore os melhores ativos funcionais para este projeto. Compare opções, selecione os mais indicados, verifique incompatibilidades e apresente a fórmula final completa.`,
    '3': `${base}\nFórmula desenvolvida:\n${f1}\n\nRealize a validação técnica completa desta fórmula.`,
    '4': `${base}\nFórmula validada:\n${f3}\n\nGere a ficha técnica oficial completa.`,
    '5': `${base}\nFicha técnica:\n${f4}\n\nGere o texto completo do rótulo conforme RDC 67/2007.`,
    '6': `${base}\nFicha técnica:\n${f4}\n\nGere os scripts de treinamento nas três versões.`,
    '7': `${base}\nFicha técnica:\n${f4}\n\nGere a estratégia completa de funil e posicionamento comercial.`,
  };
  return instrucoes[faseKey];
}

export async function* chamarAgenteStream(
  faseKey: FaseKey,
  historico: Array<{ role: 'user' | 'assistant'; content: string }>,
  mensagem: string,
  apiKey: string,
  model: string,
): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey });
  const msgs = [...historico, { role: 'user' as const, content: mensagem }];

  const stream = await client.messages.stream({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPTS[faseKey],
    messages: msgs,
  });

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text;
    }
  }
}
