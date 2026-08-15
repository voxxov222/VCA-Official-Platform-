# VCA Production Foundation

## Current implementation target

VCA uses PostgreSQL + Prisma as the production persistence layer. The existing Vite/React/Express application remains the UI/API surface during migration; existing mock/in-memory data is not considered authoritative production data.

## Trust chain

User → Submission → GradingReport → Human Review → Final Grade → Certificate → Slab → NFC/QR → Public Verification.

Finalized certification changes must be represented by auditable events rather than silent mutation.

## External dependencies

VScan identification, market pricing, payment processing, and stronger NFC cryptographic verification require separately configured providers, credentials, and/or hardware. Until configured, the API must report unavailable rather than fabricate results.

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
```

## Local PostgreSQL

```bash
docker compose up -d postgres
```

Set `DATABASE_URL` using `.env.example` before running Prisma commands.
