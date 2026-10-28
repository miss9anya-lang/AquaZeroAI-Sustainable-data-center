import { db } from "@/lib/db";
const ok = (r: Request) => !!process.env.ADMIN_TOKEN && r.headers.get("authorization") === `Bearer ${process.env.ADMIN_TOKEN}`;
// GET /api/readings?hours=6&device=name&format=csv  (Authorization: Bearer ADMIN_TOKEN)
export async function GET(req: Request) {
  if (!ok(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const u = new URL(req.url), hours = Math.min(168, Math.max(1, +(u.searchParams.get("hours") ?? 6))), device = u.searchParams.get("device");
  const rows = await db.reading.findMany({ where: { isDemo: false, ts: { gte: new Date(Date.now() - hours * 3600_000) }, ...(device ? { device: { name: device } } : {}) }, include: { device: { select: { name: true, lastSeen: true } } }, orderBy: { ts: "asc" }, take: 5000 });
  if (u.searchParams.get("format") === "csv") {
    const h = "ts,device,inletC,outletC,serverC,gpuPct,flowLpm,coolingKw,waterL,waterMeasured";
    const body = rows.map(r => [r.ts.toISOString(), r.device.name, r.inletC, r.outletC, r.serverC, r.gpuPct, r.flowLpm, r.coolingKw, r.waterL, r.waterMeasured].map(v => v ?? "").join(","));
    return new Response([h, ...body].join("\n"), { headers: { "content-type": "text/csv" } });
  }
  return Response.json({ rows });
}
