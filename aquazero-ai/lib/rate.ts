const hits = new Map<string, number[]>();
export function limited(key: string, max = 20, windowMs = 60_000) { const now = Date.now(); const a = (hits.get(key) ?? []).filter(t => now - t < windowMs); a.push(now); hits.set(key, a); return a.length > max; }
