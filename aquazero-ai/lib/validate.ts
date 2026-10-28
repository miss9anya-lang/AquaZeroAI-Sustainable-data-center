import { z } from "zod";
export const contactSchema = z.object({ name: z.string().trim().min(1).max(80), email: z.string().trim().email().max(120), message: z.string().trim().min(10).max(2000), lang: z.enum(["en","hi","mr"]).default("en") });
const opt = (lo: number, hi: number) => z.number().min(lo).max(hi).optional();
export const readingSchema = z.object({ ts: z.string().datetime(), inletC: opt(0,90), outletC: opt(0,120), serverC: opt(0,120), gpuPct: opt(0,100), flowLpm: opt(0,5000), coolingKw: opt(0,10000), waterL: opt(0,100000), waterMeasured: z.boolean().default(true) });
export function tsOk(ts: Date, now = Date.now()) { return ts.getTime() <= now + 5*60_000 && ts.getTime() >= now - 24*3600_000; }
