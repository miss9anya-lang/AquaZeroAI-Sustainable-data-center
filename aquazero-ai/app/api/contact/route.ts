import { db } from "@/lib/db"; import { contactSchema } from "@/lib/validate"; import { limited } from "@/lib/rate";
export async function POST(req: Request) {
  if (limited("c:" + (req.headers.get("x-forwarded-for") ?? "ip"), 5)) return Response.json({ error: "rate_limited" }, { status: 429 });
  const p = contactSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: "invalid", issues: p.error.flatten() }, { status: 400 });
  try { await db.contact.create({ data: p.data }); return Response.json({ ok: true }, { status: 201 }); }
  catch (e) { console.error(JSON.stringify({ evt: "contact_fail", err: String(e) })); return Response.json({ error: "server" }, { status: 500 }); }
}
