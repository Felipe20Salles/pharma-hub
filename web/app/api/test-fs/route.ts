import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const cwd = process.cwd();
    const dir = path.join(cwd, '..', 'sessoes');
    await fs.mkdir(dir, { recursive: true });
    const arquivos = await fs.readdir(dir);
    return Response.json({ ok: true, cwd, dir, arquivos });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
