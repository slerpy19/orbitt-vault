export interface TokenIconConfig {
  symbol: string;
  name: string;
  coingeckoId: string;
  coinmarketcapId?: string;
  localIcon?: string;
  network: 'solana' | 'ethereum' | 'bitcoin' | 'other';
  verified: boolean;
}

export const PHANTOM_TOKENS: TokenIconConfig[] = [
  // Major tokens from Phantom
  { symbol: 'SOL', name: 'Solana', coingeckoId: 'solana', coinmarketcapId: '5426', network: 'solana', verified: true },
  { symbol: 'USDC', name: 'USD Coin', coingeckoId: 'usd-coin', coinmarketcapId: '3408', network: 'solana', verified: true },
  { symbol: 'WIF', name: 'dogwifhat', coingeckoId: 'dogwifcoin', coinmarketcapId: '28752', network: 'solana', verified: false },
  { symbol: 'JUP', name: 'Jupiter', coingeckoId: 'jupiter-exchange-solana', coinmarketcapId: '29210', network: 'solana', verified: true },
  { symbol: 'PENGU', name: 'Pudgy Penguins', coingeckoId: 'pudgy-penguins', coinmarketcapId: '34466', network: 'solana', verified: false },
  { symbol: 'BONK', name: 'Bonk', coingeckoId: 'bonk', coinmarketcapId: '23095', network: 'solana', verified: false },
  { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum', coinmarketcapId: '1027', network: 'ethereum', verified: true },
  { symbol: 'BTC', name: 'Bitcoin', coingeckoId: 'bitcoin', coinmarketcapId: '1', network: 'bitcoin', verified: true },

  // Memes from Phantom
  { symbol: 'USELESS', name: 'Useless Coin', coingeckoId: 'useless', network: 'solana', verified: false },
  { symbol: 'CATE', name: 'Cate', coingeckoId: 'cate', network: 'solana', verified: false },
  { symbol: 'BUTTCOIN', name: 'Buttcoin', coingeckoId: 'buttcoin', network: 'solana', verified: false },
  { symbol: 'GOAT', name: 'Goatseus Maximus', coingeckoId: 'goatseus-maximus', network: 'solana', verified: false },
  { symbol: 'PANTS', name: 'Pants', coingeckoId: 'pants', network: 'solana', verified: false },
  { symbol: 'STONK', name: 'Stonk', coingeckoId: 'stonk', network: 'solana', verified: true },
  { symbol: 'EYE', name: 'Eye', coingeckoId: 'eye', network: 'solana', verified: false },

  // Additional tokens from larphantom that we keep
  { symbol: 'USDT', name: 'Tether', coingeckoId: 'tether', coinmarketcapId: '825', network: 'ethereum', verified: true },
  { symbol: 'WETH', name: 'Wrapped Ether', coingeckoId: 'weth', coinmarketcapId: '2396', network: 'ethereum', verified: true },
  { symbol: 'ARB', name: 'Arbitrum', coingeckoId: 'arbitrum', coinmarketcapId: '11841', network: 'ethereum', verified: true },
  { symbol: 'OP', name: 'Optimism', coingeckoId: 'optimism', coinmarketcapId: '11840', network: 'ethereum', verified: true },
  { symbol: 'MATIC', name: 'Polygon', coingeckoId: 'matic-network', coinmarketcapId: '3890', network: 'ethereum', verified: true },
  { symbol: 'AVAX', name: 'Avalanche', coingeckoId: 'avalanche-2', coinmarketcapId: '5805', network: 'other', verified: true },
  { symbol: 'DOT', name: 'Polkadot', coingeckoId: 'polkadot', coinmarketcapId: '6636', network: 'other', verified: true },
  { symbol: 'LINK', name: 'Chainlink', coingeckoId: 'chainlink', coinmarketcapId: '1975', network: 'ethereum', verified: true },
  { symbol: 'UNI', name: 'Uniswap', coingeckoId: 'uniswap', coinmarketcapId: '7083', network: 'ethereum', verified: true },
  { symbol: 'AAVE', name: 'Aave', coingeckoId: 'aave', coinmarketcapId: '7278', network: 'ethereum', verified: true },
];

export const COINMARKETCAP_CDN = 'https://s2.coinmarketcap.com/static/img/coins/128x128/';

export function getTokenIconUrl(symbol: string): string | null {
  const token = PHANTOM_TOKENS.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
  if (!token?.coinmarketcapId) return null;
  return `${COINMARKETCAP_CDN}${token.coinmarketcapId}.png`;
}

export function getTokenBySymbol(symbol: string): TokenIconConfig | undefined {
  return PHANTOM_TOKENS.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getTokenByCoingeckoId(id: string): TokenIconConfig | undefined {
  return PHANTOM_TOKENS.find(t => t.coingeckoId === id);
}

// Local fallback icons (SVG) for major tokens
export const LOCAL_ICONS: Record<string, string> = {
  BTC: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="60" fill="#F7931A"/><text x="64" y="72" font-size="50" font-weight="bold" fill="white" text-anchor="middle">₿</text></svg>`,
  ETH: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M64 8L20 36v56l44 28 44-28V36L64 8zm0 16l28 16-28 16-28-16 28-16z" fill="#627EEA"/><path d="M64 24l20 12-20 12-20-12 20-12z" fill="#99A9D6"/></svg>`,
  SOL: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000.svg"><defs><linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9945FF"/><stop offset="100%" stop-color="#14F195"/></linearGradient></defs><circle cx="64" cy="64" r="60" fill="url(#solGrad)"/><path d="M40 64l10 10 24-24" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  USDC: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="60" fill="#2775CA"/><text x="64" y="76" font-size="40" font-weight="bold" fill="white" text-anchor="middle">USDC</text></svg>`,
};