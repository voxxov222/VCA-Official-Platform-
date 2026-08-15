# 🛡️ VCA — VERIFIED CARD AUTHORITY
### Production collectible-card authentication, grading, verification, valuation & NFC platform

VCA (Verified Card Authority) is being built as a production-ready, self-hostable platform for collectible-card authentication, grading, certification, ownership, valuation, portfolios, marketplace workflows, VScan AI, QR verification and NFC-enabled slabs.

> **Production integrity rule:** VCA does not present simulated identification, grading, pricing, NFC verification, payment confirmation, or deployment results as real functionality. External integrations are explicitly marked unavailable until configured and verified.

---

## 🚧 Current Production Build Status

Development is being performed on the `foundation/production-stack` branch before production release to `main`.

### Implemented production foundation

- PostgreSQL + Prisma relational data layer
- Database migrations and production migration commands
- Persistent users, sessions and role-based access control
- Submission persistence
- Grading-report persistence
- Human-grader authorization boundary
- Certificate issuance and certificate state model
- Audit logging for trust-sensitive operations
- Public certificate verification API
- QR certificate records with unique public verification tokens
- NFC record binding to certificates/slabs
- NFC verification security-level model
- Tamper-status model
- QR/NFC verification audit events
- Production Docker/PostgreSQL foundation
- VScan provider boundary that refuses to fabricate results when a real provider is unavailable

---

## 📸 VScan — Real Camera Card Scanner

VScan is designed to use the user's actual phone/tablet camera to photograph a physical card.

### Camera workflow

```text
Open VScan
   ↓
Request rear-camera permission
   ↓
Align physical card in capture frame
   ↓
Take real photograph
   ↓
Review / retake
   ↓
Send image to configured vision provider
   ↓
Identify card / set / number / variant when possible
   ↓
Retrieve market data from configured provider
   ↓
Display RAW / PSA 8 / PSA 9 / PSA 10 values when available
```

The scanner must never substitute a sample card when the camera or identification provider fails.

If a real vision provider is not configured, VScan reports the provider as unavailable rather than inventing an identification.

### Market-value display

VScan is designed to display separate market observations for:

| Condition | VCA display |
|---|---|
| Raw / Ungraded | Provider-backed raw market value |
| PSA 8 | Provider-backed PSA 8 value when available |
| PSA 9 | Provider-backed PSA 9 value when available |
| PSA 10 | Provider-backed PSA 10 value when available |

Every displayed market observation should include its source and observation timestamp.

Third-party market prices are **not guaranteed sale prices** and are kept separate from any future VCA valuation indicator.

### VScan external dependencies

The camera itself uses browser camera APIs. Card identification and market valuation require configured external providers.

Example production environment variables:

```env
GEMINI_API_KEY=
PRICECHARTING_API_TOKEN=
```

Credentials must remain server-side and must never be exposed through frontend `NEXT_PUBLIC_*` variables.

If a provider is unavailable, VCA reports `UNAVAILABLE` rather than generating fake prices or identification data.

---

## 🔐 QR Certificate Verification

Every finalized VCA certificate can have a persistent QR record with a unique random public verification token.

```text
Certificate
   ↓
QR Record
   ↓
Random public token
   ↓
/verify/qr/:token
   ↓
Public certificate result
```

The QR verification layer is intentionally separate from the certificate serial. The public token is not treated as the certificate's secret or database primary key.

Public verification is designed to expose appropriate certificate information such as:

- Card identity
- VCA grade
- Certification status
- Certification date
- Slab information
- NFC status
- Tamper status where supported
- Public card/slab imagery

Private customer information is not exposed through public verification.

---

## 📡 NFC Slab Binding & Verification

NFC is treated as a physical slab identity and verification layer, not automatically as cryptographic security.

VCA distinguishes:

```text
IDENTIFIER_ONLY
CRYPTOGRAPHIC
```

A normal NFC identifier can establish an association between a physical tag and a VCA certificate, but it is not automatically proof that the tag itself is cryptographically authentic.

Future secure-element implementations can provide challenge/response or other cryptographic authentication when supported by the selected hardware.

NFC records also support tamper states such as:

```text
UNKNOWN
CLEAR
SUSPECTED
TAMPERED
```

NFC binding and tamper-state changes are restricted to authorized VCA roles and are recorded in the audit trail.

---

## 🧾 Grading & Certification Trust Chain

```text
Customer
   ↓
Submission
   ↓
Authorized Grader
   ↓
Grading Report
   ↓
Human Review
   ↓
Final Grade
   ↓
VCA Certificate
   ↓
Slab
   ├── QR
   └── NFC
        ↓
Public Verification
```

Finalized certification records are auditable. Important changes are recorded as events instead of silently rewriting certification history.

---

## 🏗️ Production Architecture

```text
Next.js / React / TypeScript frontend
              │
              ▼
      TypeScript API layer
              │
       ┌──────┴──────┐
       ▼             ▼
 PostgreSQL       S3-compatible storage
   + Prisma
       │
       ├── Authentication / RBAC
       ├── Cards / Sets / Variants
       ├── Submissions
       ├── Grading
       ├── Certificates
       ├── QR / NFC
       ├── Ownership
       ├── Portfolio
       ├── Market data
       └── Audit logs
```

Docker, PostgreSQL, migrations, environment variables, persistent storage, health checks, HTTPS/reverse-proxy compatibility and backup procedures are part of the production architecture.

---

## 🎨 VCA Design System

The application follows the established VCA HUD aesthetic:

- Near-black graphite backgrounds
- Electric cyan primary accent
- Violet secondary accent
- Gold/amber reserved for premium grade/mint moments
- Orbitron display typography
- JetBrains Mono for serials/data
- Glass panels
- Scanline/HUD effects
- Holographic foil effects
- Premium slab presentation
- Reduced-motion fallbacks

The canonical slab includes VCA branding, NFC badge, card window, grade, card identity, metadata, serial/certificate information and QR presentation.

---

## 🧰 Technology Stack

| Layer | Production direction |
|---|---|
| Frontend | Next.js / React / TypeScript |
| API | Node.js / TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Storage | S3-compatible object storage |
| Infrastructure | Docker / Linux VPS |
| Reverse proxy | Nginx or Caddy |
| Camera | Browser MediaDevices / camera APIs |
| Vision | Configurable external vision provider |
| Market data | Configurable reputable market-data providers |
| NFC | Browser/native NFC adapters depending on hardware |
| Authentication | Secure server-side sessions + RBAC |

The repository may still contain legacy prototype components during migration. Those are not automatically considered production-ready merely because they remain in the codebase.

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- npm
- Docker / Docker Compose
- PostgreSQL through the provided Docker configuration

### Install

```bash
npm install
```

### Configure

```bash
cp .env.example .env
```

Set the required database/session variables and any external provider credentials you intend to enable.

### Generate Prisma client

```bash
npx prisma generate --schema packages/database/prisma/schema.prisma
```

### Apply production migrations

```bash
npx prisma migrate deploy --schema packages/database/prisma/schema.prisma
```

### Development database migration

```bash
npx prisma migrate dev --schema packages/database/prisma/schema.prisma
```

> A live database migration, full application build and end-to-end camera/market-provider test must be executed in an environment with the required dependencies and credentials before those checks are reported as passed.

---

## 📋 Recent Production Changes

### QR + NFC trust layer

- Added persistent QR certificate records
- Added unique public QR verification tokens
- Added QR verification endpoint
- Added NFC certificate/slab binding
- Added NFC verification endpoint
- Added NFC security-level distinction
- Added tamper-status tracking
- Added verification/binding audit events
- Prevented duplicate NFC identifier binding

### VScan production correction

- Replaced prototype/sample-card scanner behavior with real camera capture architecture
- Rear camera is preferred for physical-card capture
- Added capture/review/retake flow
- Added image upload path
- Added provider-backed identification boundary
- Removed fake identification fallback from the production path
- Added market-data provider architecture
- Added RAW / PSA 8 / PSA 9 / PSA 10 result structure
- Added source/timestamp requirements for market observations
- Added explicit unavailable states when providers are not configured

### Grading/certification foundation

- Added authorized grader workflow
- Added grading report persistence
- Added human-review boundary
- Added certificate generation
- Added unique certificate identifiers
- Added certificate verification data
- Added audit logging

---

## ⚠️ Production Verification Policy

The following are **not claimed as production-tested simply because the code exists**:

- Live PostgreSQL migration
- Live production build
- Live camera test on a physical device
- Live vision-provider identification
- Live market-provider pricing
- Live NFC hardware verification
- Payment processing
- VPS deployment

Each dependency must be configured and tested before its capability is marked operational.

---

## 📄 License

This project is licensed under the MIT License.

*Copyright © 2026 VCA Verified Card Authority. All Rights Reserved.*
