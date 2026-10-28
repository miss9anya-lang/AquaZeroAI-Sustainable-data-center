import { PrismaClient } from "@prisma/client"; import { createHash, randomBytes } from "crypto";
const p = new PrismaClient();
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
async function main() { const key = randomBytes(24).toString("hex");
  await p.device.upsert({ where: { name: "demo-esp32-1" }, update: { keyHash: sha(key) }, create: { name: "demo-esp32-1", keyHash: sha(key) } });
  console.log("Device 'demo-esp32-1' key (shown once):", key); }
main().finally(() => p.$disconnect());
