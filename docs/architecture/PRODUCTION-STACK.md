# VCA Production Stack

## Status
Foundation architecture for the production VCA platform.

## Runtime
- Web: Next.js + React + TypeScript
- API: TypeScript/Node.js service
- Database: PostgreSQL
- ORM: Prisma
- Object storage: S3-compatible storage
- Infrastructure: Docker, Linux VPS, Nginx/Caddy, HTTPS

## Trust boundaries
1. Browser/client is untrusted.
2. API validates authentication, authorization and all input.
3. PostgreSQL is the source of record for business state.
4. Object storage contains immutable/versioned card and certificate media references.
5. External AI, market-data, payment and NFC integrations are adapters; provider output is never treated as authoritative without VCA validation and provenance.

## Certification integrity
Finalized certificates are append-only from the application's perspective. Corrections create auditable events/revisions rather than silently mutating historical certification facts.

## NFC security model
VCA distinguishes NFC identification, tamper evidence, tamper detection and cryptographic authentication. A basic NFC UID is not treated as proof of authenticity.

## Development rule
The existing Vite/Express prototype remains useful as reference material, but production work should migrate toward this stack without destroying useful UI/component work. Do not claim a migration is complete until it is implemented and verified.
