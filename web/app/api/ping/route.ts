export const runtime = 'nodejs';

export async function GET() {
  return Response.json({ ok: true, cwd: process.cwd() });
}

export async function POST() {
  return Response.json({ ok: true });
}
