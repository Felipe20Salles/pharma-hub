import fs from 'fs';
import path from 'path';
import { Sessao } from './models/Sessao';

const DIR = path.resolve(process.cwd(), 'sessoes');

function garantirDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
}

export function salvarSessao(sessao: Sessao): void {
  garantirDir();
  sessao.atualizadaEm = new Date().toISOString();
  fs.writeFileSync(path.join(DIR, `${sessao.id}.json`), JSON.stringify(sessao, null, 2), 'utf-8');
}

export function carregarSessao(id: string): Sessao | null {
  const arquivo = path.join(DIR, `${id}.json`);
  if (!fs.existsSync(arquivo)) return null;
  return JSON.parse(fs.readFileSync(arquivo, 'utf-8')) as Sessao;
}

export function carregarUltimaSessao(): Sessao | null {
  garantirDir();
  const arquivos = fs.readdirSync(DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ nome: f, stat: fs.statSync(path.join(DIR, f)) }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

  if (arquivos.length === 0) return null;
  return JSON.parse(fs.readFileSync(path.join(DIR, arquivos[0].nome), 'utf-8')) as Sessao;
}

export function listarSessoes(): Sessao[] {
  garantirDir();
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8')) as Sessao)
    .sort((a, b) => new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime());
}
