import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
// SSE: latest non-demo reading per device every 5 s (Authorization: Bearer ADMIN_TOKEN; use fetch streaming)
export async function GET(req: Request) {
  if (!process.env.ADMIN_TOKEN || req.headers.get("authorization") !== `Bearer ${process.env.ADMIN_TOKEN}`) return new Response("unauthorized", { status: 401 });
  const enc = new TextEncoder(); let id: ReturnType<typeof setInterval>;
  const s = new ReadableStream({
    start(c) { const send = async () => { const devs = await db.device.findMany({ include: { readings: { where: { isDemo: false }, orderBy: { ts: "desc" }, take: 1 } } });
      c.enqueue(enc.encode(`data: ${JSON.stringify(devs.map(d => ({ name: d.name, lastSeen: d.lastSeen, latest: d.readings[0] ?? null })))}\n\n`)); };
      send(); id = setInterval(send, 5000); req.signal.addEventListener("abort", () => clearInterval(id)); },
    cancel() { clearInterval(id); } });
  return new Response(s, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
}
