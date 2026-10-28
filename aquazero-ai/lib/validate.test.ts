import { describe, it, expect } from "vitest"; import { readingSchema, contactSchema, tsOk } from "./validate";
describe("validation", () => {
  it("rejects out-of-range temps", () => expect(readingSchema.safeParse({ ts: new Date().toISOString(), inletC: 500 }).success).toBe(false));
  it("accepts valid reading", () => expect(readingSchema.safeParse({ ts: new Date().toISOString(), inletC: 25, outletC: 38 }).success).toBe(true));
  it("rejects stale timestamps", () => expect(tsOk(new Date(Date.now() - 3 * 86400_000))).toBe(false));
  it("rejects short contact message", () => expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: "hi" }).success).toBe(false));
});
