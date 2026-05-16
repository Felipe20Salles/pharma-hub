import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY não definida. Crie um arquivo .env baseado no .env.example');
}

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-opus-4-5';
