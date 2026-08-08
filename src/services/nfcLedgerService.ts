import { SlabCertificate, LedgerEvent, CardRecord } from '../types/vca';
import { INITIAL_CARDS_DATABASE } from './cardsDatabase';

// Initial Seed Slab & Ledger Events
export const SEED_SLAB_CERTIFICATE: SlabCertificate = {
  certificateId: 'CERT-VCA-000-001',
  serialNumber: 'VCA-000-000-001',
  cardId: 'sv3pt5-173',
  cardName: 'Pikachu',
  setName: '151 (Special Illustration Rare)',
  cardNumber: '173/165',
  variant: 'Illustration Rare',
  language: 'English',
  overallGrade: 10,
  gradeLabel: 'GEM MINT',
  subgrades: {
    centering: 10,
    corners: 9.8,
    edges: 10,
    surface: 10
  },
  nfcUid: '04:E8:32:FA:89:11:80',
  nfcStatus: 'ACTIVE_SEAL_INTACT',
  ownerName: 'Todd W. (Vault Owner)',
  authenticatedAt: '2026-05-22T10:42:00Z',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vca.authority/verify/VCA-000-000-001',
  cryptographicHash: '0x8f2e4a19c5b73d2e0f1a943827bc4e92f15a3c8902d1847e',
  ledgerTxHash: '0x3c71b9e024f9a187d8e204c35b91a782f91a0c4e12348590',
  imageUrl: 'https://images.pokemontcg.io/sv3pt5/173_hires.png'
};

export const INITIAL_LEDGER_EVENTS: LedgerEvent[] = [
  {
    id: 'tx-001',
    timestamp: '2026-05-22T10:40:00Z',
    eventType: 'CARD_SCANNED',
    serialNumber: 'VCA-000-000-001',
    cardName: 'Pikachu 151 #173/165',
    actor: 'VScan AI Scanner Engine v3.4',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    metadata: { scannerConfidence: 99.4, multiCameraPass: true }
  },
  {
    id: 'tx-002',
    timestamp: '2026-05-22T10:41:15Z',
    eventType: 'CARD_GRADED',
    serialNumber: 'VCA-000-000-001',
    cardName: 'Pikachu 151 #173/165',
    actor: 'VCA Senior Grading QC Panel',
    previousHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    currentHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    metadata: { finalGrade: 10, subgradeCentering: 10, subgradeCorners: 9.8, tier: 'Gem Mint' }
  },
  {
    id: 'tx-003',
    timestamp: '2026-05-22T10:42:00Z',
    eventType: 'NFC_LINKED',
    serialNumber: 'VCA-000-000-001',
    cardName: 'Pikachu 151 #173/165',
    actor: 'NTAG424 DNA Encrypted Issuer',
    previousHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    currentHash: '0x3c71b9e024f9a187d8e204c35b91a782f91a0c4e12348590',
    metadata: { nfcUid: '04:E8:32:FA:89:11:80', sunCmacVerified: true, sealStatus: 'INTACT' }
  }
];

// Local state for certificates and ledger
let certificateStore: SlabCertificate[] = [SEED_SLAB_CERTIFICATE];
let ledgerEventsStore: LedgerEvent[] = [...INITIAL_LEDGER_EVENTS];

export function getCertificateBySerial(serialNumber: string): SlabCertificate | undefined {
  return certificateStore.find(
    c => c.serialNumber.toLowerCase() === serialNumber.toLowerCase() || c.certificateId.toLowerCase() === serialNumber.toLowerCase()
  );
}

export function getAllCertificates(): SlabCertificate[] {
  return [...certificateStore];
}

export function getAllLedgerEvents(): LedgerEvent[] {
  return [...ledgerEventsStore];
}

export function createDigitalCertificate(
  card: CardRecord,
  grade: number,
  subgrades: { centering: number; corners: number; edges: number; surface: number },
  ownerName: string
): SlabCertificate {
  const serialIndex = certificateStore.length + 1;
  const serialNumber = `VCA-000-000-${serialIndex.toString().padStart(3, '0')}`;
  const certId = `CERT-VCA-00${serialIndex}`;
  const nfcUid = `04:${Math.floor(Math.random()*89+10).toString(16)}:${Math.floor(Math.random()*89+10).toString(16)}:${Math.floor(Math.random()*89+10).toString(16)}:80`;
  
  const prevHash = ledgerEventsStore[ledgerEventsStore.length - 1]?.currentHash || '0x000';
  const currHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

  const cert: SlabCertificate = {
    certificateId: certId,
    serialNumber,
    cardId: card.id,
    cardName: card.pokemonName,
    setName: card.setName,
    cardNumber: card.cardNumber,
    variant: card.variant,
    language: card.language,
    overallGrade: grade,
    gradeLabel: grade === 10 ? 'GEM MINT' : grade === 9 ? 'MINT' : 'NEAR MINT',
    subgrades,
    nfcUid,
    nfcStatus: 'ACTIVE_SEAL_INTACT',
    ownerName,
    authenticatedAt: new Date().toISOString(),
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vca.authority/verify/${serialNumber}`,
    cryptographicHash: '0x8f' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    ledgerTxHash: currHash,
    imageUrl: card.imageUrl
  };

  certificateStore.unshift(cert);

  // Append Ledger event
  const event: LedgerEvent = {
    id: `tx-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'CERTIFICATE_CREATED',
    serialNumber,
    cardName: `${card.pokemonName} (${card.setName} #${card.cardNumber})`,
    actor: 'VCA NFC Ledger Protocol',
    previousHash: prevHash,
    currentHash: currHash,
    metadata: { ownerName, overallGrade: grade, certId }
  };

  ledgerEventsStore.unshift(event);

  return cert;
}

export function appendLedgerEvent(
  eventType: LedgerEvent['eventType'],
  serialNumber: string,
  cardName: string,
  actor: string,
  metadata: Record<string, any>
): LedgerEvent {
  const prevHash = ledgerEventsStore[0]?.currentHash || '0x000';
  const currentHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

  const newEvent: LedgerEvent = {
    id: `tx-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType,
    serialNumber,
    cardName,
    actor,
    previousHash: prevHash,
    currentHash,
    metadata
  };

  ledgerEventsStore.unshift(newEvent);
  return newEvent;
}

// Check Web NFC Availability in browser
export function isWebNfcSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}
