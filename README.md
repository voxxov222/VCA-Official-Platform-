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

## 🎨 Approved VCA Brand Assets

The latest VCA brand references supplied for production have been incorporated into the application design system.

### Slab label

`public/branding/vca-slab-label.svg`

This is the canonical premium slab-label direction: VCA chrome mark, grade block, serial field, NFC authentication area, circuit-board/HUD detailing and cyan illumination.

### Interactive trust splash

`public/branding/vca-splash-screen.svg`

The splash presentation is now based on the supplied **VCA: The Future of Collectible Trust** technology-board visual. It presents the VCA slab architecture, VScan AI, NFC smart-slab layer, tamper-evidence layer and verification ledger in a single interactive hero presentation.

### Splash interaction

`src/components/SplashPage.tsx`

The splash is no longer a static image-only screen. It now supports:

- Pointer parallax on desktop
- Touch/pointer drag interaction
- Animated HUD scanlines
- Holographic shimmer sweep
- Pulsing interactive technology hotspots
- VScan hotspot → launches the real VScan camera flow
- NFC/tamper/ledger hotspots → contextual technology panels
- Accessible dialog controls
- Reduced-motion fallback
- Optional browser-safe splash audio
- Direct **ENTER VCA** action

The presentation is visual/marketing UI. It does **not** turn a depicted feature into a claimed production capability. The hotspot descriptions explicitly preserve VCA's trust rule around configured hardware and external providers.

### Slab showcase

`public/branding/vca-slab-showcase.svg`

The dashboard/home experience also includes the approved premium slab presentation direction with verification, grade, certificate and QR treatment.

### Branding rules

- Near-black graphite base
- Electric cyan primary accent
- Violet secondary accent
- Chrome/silver VCA hardware treatment
- Gold/amber reserved for premium grading moments
- Orbitron display typography
- JetBrains Mono for serials and technical data
- HUD/circuit detailing rather than generic AI gradients
- No unsupported claims such as guaranteed authenticity, tamper-proof hardware or live data without the corresponding verified integration

---

## 🌐 Production Web Target

The current Vercel deployment target is:

urlVCA Official Platformhttps://vca-official-platform.vercel.app/

The latest splash/branding implementation is committed to `main`. Vercel must be connected to the configured production branch for the public deployment to reflect the commit.

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

### Interactive trust splash — August 2026

- Replaced the previous splash artwork with the supplied VCA **The Future of Collectible Trust** technology presentation direction
- Reworked `SplashPage` as an interactive presentation instead of a static screen
- Added desktop pointer parallax
- Added touch/pointer drag interaction
- Added animated HUD scanline and holographic shimmer effects
- Added clickable VScan, NFC, tamper and ledger hotspots
- Added accessible contextual technology dialogs
- Added reduced-motion support
- Connected the splash VScan action to the real camera scanner modal
- Added production-integrity copy so depicted hardware does not imply an unconfigured integration is live

### Branding update

- Added approved VCA slab-label branding asset
- Added approved VCA splash-screen branding asset
- Added approved VCA slab-showcase branding asset
- Added the canonical slab label to the home experience
- Added slab showcase presentation to the home experience
- Removed prototype-style unsupported metrics/claims from the home experience
- Changed NFC CTA language from simulation wording to verification wording

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