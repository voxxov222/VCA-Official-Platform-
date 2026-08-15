# VScan market data

VScan now uses a provider adapter rather than hard-coded prices.

## PriceCharting

Set `PRICECHARTING_API_TOKEN` on the server. PriceCharting's paid API supports current Pokémon card values for ungraded cards and graded values including Grade 8, Grade 9, and PSA 10. Values are returned in cents by the provider and converted to USD in VCA.

VCA maps:

- `loose-price` → RAW
- `new-price` → PSA 8
- `graded-price` → PSA 9
- `manual-only-price` → PSA 10

The provider's product search is based on the card name, set and collector number returned by VScan. If the provider cannot confidently match a product, VCA displays `UNAVAILABLE` rather than estimating a value.

## Raw fallback

If PriceCharting is unavailable, VScan can use the Pokémon TCG API/TCGplayer market price for RAW only. PSA 8/9/10 remain unavailable until a verified graded provider is connected.

## Important

These are third-party market indicators, not VCA-guaranteed sale prices. Store provider name and observation timestamp with market snapshots when persistence is enabled.
