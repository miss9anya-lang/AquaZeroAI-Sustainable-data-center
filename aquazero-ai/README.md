# AquaZero AI
Status: UNTESTED scaffold. Run the steps below and fix anything that differs on your machine.
## Run locally
1. `cp .env.example .env`; set `ADMIN_TOKEN` to a long random value.
2. `docker compose up -d` (PostgreSQL), then `npm install`.
3. `npx prisma migrate dev --name init`, then `npm run db:seed` (prints a device key once; save it).
4. `npm run dev` and open http://localhost:3000. Tests: `npm test`.
5. Optional ML: `cd ml && pip install -r requirements.txt && uvicorn main:app --port 8000`.
## What exists
- `public/aquazero.html`: UI (EN/HI/MR, light/dark, dashboard shows DEMO data only, labelled). Contact form posts to `/api/contact` (stored in Postgres).
- `POST /api/ingest`: device ingestion (headers `x-device-name`, `x-device-key`; JSON body per `lib/validate.ts`). Validates ranges and timestamps, rate limited, updates last-seen, raises alerts. Use HTTPS in production.
- `GET /api/readings?hours=6&device=NAME&format=csv` and `GET /api/stream` (SSE) need `Authorization: Bearer $ADMIN_TOKEN`.
- `GET /api/health`. ML `POST /predict` on port 8000 (rule baseline, not trained).
Example: `curl -X POST localhost:3000/api/ingest -H 'x-device-name: demo-esp32-1' -H 'x-device-key: KEY' -H 'content-type: application/json' -d '{"ts":"2026-10-28T10:00:00Z","inletC":26,"outletC":38}'`
## Not built yet
User login/registration and settings, UI wired to live readings, MQTT bridge, e2e tests, audit-event writes, deployment config.
Never auto-control cooling hardware; keep independent hardware safety controls.
