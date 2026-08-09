# 🛡️ VCA — VERIFIED CARD AUTHORITY
### *Next-Generation Collectible Authentication, NFC Smart Slabs, AI Grading & Slabbook Social Platform*

[![Platform Status](https://img.shields.io/badge/VCA_System-Online_100%25-22d3ee.svg)](#)
[![NTAG424 Security](https://img.shields.io/badge/NFC_Protocol-NTAG424_DNA_CMAC-emerald.svg)](#)
[![AI Engine](https://img.shields.io/badge/Vision_AI-Gemini_3.6_Multimodal-indigo.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)

VCA (Verified Card Authority) is a production-grade collectible trading card grading, authentication, market intelligence, and social platform for Pokémon card collectors and investors. It integrates computer vision AI (VScan AI), NTAG424 DNA CMAC encrypted physical smart slabs, an immutable cryptographic SHA-256 ledger, real-time multi-market price consensus, and **Foilbook (Slabbook)** — a full-featured Facebook-style social network with direct live messaging for Pokémon collectors.

---

## 📸 APPLICATION SCREENSHOTS & SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  🛡️ VCA VERIFIED CARD AUTHORITY  │ [📷 VSCAN AI]  │  ((o)) NFC TAP  │ [👤 Alex Vance]    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ ⚡ BREAKING WIRE: 🟢 CHARIZARD BASE SET 1ST ED PSA 10 SURGES +14.8% TO $9,850 CAD      │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  📊 INVESTMENT DASHBOARD                                                                │
│  TOTAL VAULT VALUE: $42,850.00 CAD  │  AUTHENTICATED SLABS: 14 SLABS (100% CMAC OK)    │
│  AVERAGE GRADE: 9.6 / 10            │  PENDING SUBMISSIONS: 2 IN QC                      │
│                                                                                         │
│  [📈 30-Day Valuation Curve]  │  [🍩 Set Allocation Chart]                             │
│                                                                                         │
│  AUTHENTICATED SLABS SHOWCASE:                                                          │
│  ┌──────────────────────────┐  ┌──────────────────────────┐                             │
│  │ ⚡ Pikachu #173/165      │  │ 🔥 Charizard #4/102      │                             │
│  │ 151 (Scarlet & Violet)   │  │ Base Set • 1st Edition    │                             │
│  │ VCA #10 GEM MINT         │  │ VCA #9 MINT              │                             │
│  │ Est. CAD $2,850          │  │ Est. CAD $1,650          │                             │
│  └──────────────────────────┘  └──────────────────────────┘                             │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. 📊 Investment Dashboard & Portfolio Analytics
Real-time vault valuation tracking, 30-day performance curves (Recharts), set allocation breakdown, average grade score calculation, and verified slab management.

![Investment Dashboard](https://raw.githubusercontent.com/t-sinclair2500/pokemon-scanner/main/docs/dashboard_mockup.png)

```
┌─────────────────────────────────────────────────────────────┐
│  ((o)) NTAG424 CMAC NFC TAP VERIFICATION                    │
│  Encrypted Smart Slab DNA Verification                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      ((  ((( 🛈 )))  ))                    │
│                    TAP TO SCAN SMART SLAB                   │
│                                                             │
│  ✅ AUTHENTICATED • SEAL INTACT (100% CMAC OK)              │
│  NTAG424 CMAC Match: E0040150993B41C2                       │
│                                                             │
│  Pikachu 151 (Scarlet & Violet) #173/165                    │
│  Est. CAD $2,850 • [VCA | #10 GEM MINT ((o))]               │
│                                                             │
│  [View Details] [Sign as Owner] [List for Sale] [Ledger]    │
└─────────────────────────────────────────────────────────────┘
```

### 2. 🛈 NTAG424 DNA Encrypted NFC Verification
Tap-to-verify interface reading hardware NTAG424 DNA smart slabs. Executes SUN/CMAC dynamic signature validation against the VCA ledger to detect tampering, cloning, or physical slab forgery.

### 3. 📜 Immutable Ownership & Scan Ledger
Audit log of all card events (`CARD_SCANNED`, `CARD_IDENTIFIED`, `CARD_GRADED`, `NFC_LINKED`, `OWNERSHIP_SIGNED`, `CARD_TRANSFERRED`). Every event contains previous and current SHA-256 cryptographic hashes and actor signatures.

### 4. 🛍️ Verified Marketplace & Live Auctions
Live auction rooms with real-time countdowns, active bid feeds, instant buy-now listings, and zero-fraud escrow guarantees.

### 5. 💬 Foilbook (Slabbook) & Direct Messenger
A full-featured social platform for Pokémon collectors with profile customization, photo posts, collection highlights, live 1:1 messaging, and embedded slab trade proposals.

---

## ⚡ CORE FEATURES

### 1. 📸 VScan AI Camera & Condition Scoring
* **Multimodal Vision Model**: Powered by Google Gemini 3.6 for automated set, card number, variant (1st Edition, Shadowless, Holo, Reverse Holo, Alt Art, SIR), and language identification.
* **10-Step Guided Submission**: Capture front, back, low-angle warp shots, 4 corner reticles, and 4 edge reticles.
* **VGAS 10-Point Scoring**: Returns subgrade breakdowns for Centering, Corners, Edges, and Surface.

### 2. 🛈 NTAG424 DNA Smart Slabs & Cryptographic Ledger
* **NFC Verification**: Reads dynamic CMAC encryption keys embedded in physical VCA acrylic slabs.
* **Digital Ownership Signature**: Owners can append a cursive cryptographic signature directly onto the slab's ledger record.
* **Transfer & Escrow**: Ownership transfers produce verifiable PDF-style transfer certificates.

### 3. 👤 Profile & Custom Image Upload
* **Custom Profile Photo Upload**: Upload custom avatar photos (`image/*`) with instant base64 preview and persistence across header, posts, and messaging.
* **Custom Cover Banner**: Upload custom profile header images.
* **Collector Credentials**: Display Name, Username/Handle, Bio, Favorite Pokémon, Location, and Verified Trader Badges.

### 4. 📺 CNN-Style Live Pokémon News & Rare Price Wire
* **Pulsing Live Ticker**: Top-of-page CNN-style marquee streaming live market updates.
* **Live Rare Card Prices**: Real-time sales tracking for Charizard 1st Ed, Pikachu 151 SIR, Umbreon VMAX Alt Art, Illustrator Pikachu, and Lugia Neo Genesis.
* **CNN News Broadcast Room**: Interactive news drawer with breaking market news, auction records, and VCA platform updates.

---

## 🛠️ TECH STACK

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **State & Persistence**: LocalStorage sync service, Auth Service with Reactive Subscriptions
* **Camera & Hardware**: Web Camera API, Web NFC API (`NDEFReader`)

---

## 🚀 QUICK START & LOCAL DEVELOPMENT

```bash
# 1. Clone the repository
git clone https://github.com/t-sinclair2500/pokemon-scanner.git
cd pokemon-scanner

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will launch on `http://localhost:3000`.

---

## 📄 LICENSE

Licensed under the MIT License. Copyright © 2026 VCA Verified Card Authority.
