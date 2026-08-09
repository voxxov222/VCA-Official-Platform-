import { addToPortfolio } from './portfolioService';
import { INITIAL_CARDS_DATABASE } from './cardsDatabase';

export interface AddVaultCardParams {
  name: string;
  set: string;
  number: string;
  rarity: string;
  cardImageUrl: string;
  rawPrice: number;
  psa9Price: number;
  psa10Price: number;
}

export function addCardToVault(params: AddVaultCardParams) {
  const baseCard = INITIAL_CARDS_DATABASE[0];

  const cardRecord = {
    ...baseCard,
    id: `custom-3d-${Date.now()}`,
    pokemonName: params.name,
    name: params.name,
    setName: params.set,
    set: params.set,
    cardNumber: params.number,
    number: params.number,
    rarity: params.rarity,
    imageUrl: params.cardImageUrl,
    market: {
      ...baseCard.market,
      rawPriceUSD: params.rawPrice,
      psa9PriceUSD: params.psa9Price,
      psa10PriceUSD: params.psa10Price,
      consensusUSD: params.psa10Price
    }
  };

  return addToPortfolio(cardRecord, params.rawPrice, 'Added via 3D Digital Card Collection Studio');
}
