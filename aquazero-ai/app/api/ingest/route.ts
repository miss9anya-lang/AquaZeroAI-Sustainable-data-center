import { createHash } from "crypto"; import { db } from "@/lib/db"; import { readingSchema, tsOk } from "@/lib/validate"; import { limited } from "@/lib/rate";
// POST /api/ingest  headers: x-device-name, x-device-key; body: one reading (JSON). HTTPS only in production.
export async function POST(req: Request) {
  const name = req.headers.get("x-device-name") ?? "", key = req.headers.get("x-device-key") ?? "";
  if (limited("i:" + name, 120)) return Response.json({ error: "rate_limited" }, { status: 429 });
  const dev = await db.device.findUnique({ where: { name } });
  if (!dev || dev.keyHash !== createHash("sha256").update(key).digest("hex")) return Response.json({ error: "unauthorized" }, { status: 401 });
  const p = readingSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: "invalid", issues: p.error.flatten() }, { status: 400 });
  const ts = new Date(p.data.ts); if (!tsOk(ts)) return Response.json({ error: "stale_or_future_timestamp" }, { status: 422 });
  await db.reading.create({ data: { ...p.data, ts, deviceId: dev.id, isDemo: false } });
  await db.device.update({ where: { id: dev.id }, data: { lastSeen: new Date() } });
  if ((p.data.outletC ?? 0) > 45) await db.alert.create({ data: { deviceId: dev.id, level: "warning", message: `Outlet ${p.data.outletC} C above default limit 45 C` } });
  return Response.json({ ok: true }, { status: 201 });
}
