import type { Chain, Token } from './types';

// Use Vite's BASE_URL at runtime (works with GitHub Pages base path)
const getBasePath = () => import.meta.env.BASE_URL || '/orbitt-vault/';

export const PRICE_SOURCE = 'CoinGecko API / CoinMarketCap Icons';
export const SNAPSHOT_RETRIEVED_AT = new Date().toISOString();

type AssetSeed = {
  id: string;
  symbol: string;
  name: string;
  chain: Chain;
  price: number;
  change24h: number;
  marketCap: number;
  volatility: number;
  icon: string;
  iconPath: string; // Relative path like 'tokens/sol.svg'
  coingeckoId: string;
  coinPaprikaId?: string;
  verified: boolean;
};

const assetSeeds: AssetSeed[] = [
  // Phantom Blue Chips
  { id: 'solana', symbol: 'SOL', name: 'Solana', chain: 'Solana', price: 198.32, change24h: 4.21, marketCap: 94200000000, volatility: 0.00032, icon: '', iconPath: 'tokens/sol.svg', coingeckoId: 'solana', verified: true },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', chain: 'Solana', price: 1.0, change24h: 0.01, marketCap: 62400000000, volatility: 0.000005, icon: '', iconPath: 'tokens/usdc.svg', coingeckoId: 'usd-coin', verified: true },
  { id: 'dogwifcoin', symbol: 'WIF', name: 'dogwifhat', chain: 'Solana', price: 1.428, change24h: 12.84, marketCap: 1400000000, volatility: 0.0005, icon: '', iconPath: 'tokens/wif.svg', coingeckoId: 'dogwifcoin', verified: false },
  { id: 'jupiter-exchange-solana', symbol: 'JUP', name: 'Jupiter', chain: 'Solana', price: 0.784, change24h: -2.1, marketCap: 2100000000, volatility: 0.0004, icon: '', iconPath: 'tokens/jup.svg', coingeckoId: 'jupiter-exchange-solana', verified: true },
  { id: 'pudgy-penguins', symbol: 'PENGU', name: 'Pudgy Penguins', chain: 'Solana', price: 0.0312, change24h: 21.4, marketCap: 1900000000, volatility: 0.0005, icon: '', iconPath: 'tokens/pengu.svg', coingeckoId: 'pudgy-penguins', verified: false },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', chain: 'Solana', price: 0.00002214, change24h: 8.64, marketCap: 1700000000, volatility: 0.0006, icon: '', iconPath: 'tokens/bonk.svg', coingeckoId: 'bonk', verified: false },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', chain: 'Ethereum', price: 3412.5, change24h: 2.97, marketCap: 410000000000, volatility: 0.00018, icon: '', iconPath: 'tokens/eth.svg', coingeckoId: 'ethereum', verified: true },
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', chain: 'Bitcoin', price: 64152.02, change24h: 2.68, marketCap: 1260000000000, volatility: 0.00012, icon: '', iconPath: 'tokens/btc.svg', coingeckoId: 'bitcoin', verified: true },

  // Phantom Memes
  { id: 'useless', symbol: 'USELESS', name: 'Useless Coin', chain: 'Solana', price: 0.06428, change24h: 24.87, marketCap: 64000000, volatility: 0.0008, icon: '', iconPath: 'tokens/useless.svg', coingeckoId: 'useless', verified: false },
  { id: 'cate', symbol: 'CATE', name: 'Cate', chain: 'Solana', price: 0.05321, change24h: 64.65, marketCap: 51000000, volatility: 0.0008, icon: '', iconPath: 'tokens/cate.svg', coingeckoId: 'cate', verified: false },
  { id: 'buttcoin', symbol: 'BUTTCOIN', name: 'Buttcoin', chain: 'Solana', price: 0.01376, change24h: 14.76, marketCap: 12000000, volatility: 0.0008, icon: '', iconPath: 'tokens/buttcoin.svg', coingeckoId: 'buttcoin', verified: false },
  { id: 'goatseus-maximus', symbol: 'GOAT', name: 'Goatseus Maximus', chain: 'Solana', price: 0.01652, change24h: 6.87, marketCap: 16000000, volatility: 0.0008, icon: '', iconPath: 'tokens/goat.svg', coingeckoId: 'goatseus-maximus', verified: false },
  { id: 'pants', symbol: 'PANTS', name: 'Pants', chain: 'Solana', price: 0.00117, change24h: 847.8, marketCap: 1100000, volatility: 0.001, icon: '', iconPath: 'tokens/pants.svg', coingeckoId: 'pants', verified: false },
  { id: 'stonk', symbol: 'STONK', name: 'Stonk', chain: 'Solana', price: 0.00671, change24h: -5.36, marketCap: 6200000, volatility: 0.0007, icon: '', iconPath: 'tokens/stonk.svg', coingeckoId: 'stonk', verified: true },
  { id: 'eye', symbol: 'EYE', name: 'Eye', chain: 'Solana', price: 0.00481, change24h: 213934.27, marketCap: 4800000, volatility: 0.001, icon: '', iconPath: 'tokens/eye.svg', coingeckoId: 'eye', verified: false },

  // Additional major tokens
  { id: 'tether', symbol: 'USDT', name: 'Tether', chain: 'Ethereum', price: 0.999, change24h: 0.01, marketCap: 115000000000, volatility: 0.000005, icon: '', iconPath: 'tokens/usdt.svg', coingeckoId: 'tether', verified: true },
  { id: 'weth', symbol: 'WETH', name: 'Wrapped Ether', chain: 'Ethereum', price: 3412.5, change24h: 2.97, marketCap: 12000000000, volatility: 0.00018, icon: '', iconPath: 'tokens/weth.svg', coingeckoId: 'weth', verified: true },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', chain: 'Ethereum', price: 0.72, change24h: 1.2, marketCap: 2800000000, volatility: 0.0003, icon: '', iconPath: 'tokens/arb.svg', coingeckoId: 'arbitrum', verified: true },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', chain: 'Ethereum', price: 1.85, change24h: -0.5, marketCap: 1900000000, volatility: 0.0003, icon: '', iconPath: 'tokens/op.svg', coingeckoId: 'optimism', verified: true },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', chain: 'Ethereum', price: 0.38, change24h: 1.1, marketCap: 3500000000, volatility: 0.0003, icon: '', iconPath: 'tokens/matic.svg', coingeckoId: 'matic-network', verified: true },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', chain: 'Avalanche', price: 18.5, change24h: 2.1, marketCap: 7500000000, volatility: 0.00033, icon: '', iconPath: 'tokens/avax.svg', coingeckoId: 'avalanche-2', verified: true },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', chain: 'Polkadot', price: 4.2, change24h: 0.8, marketCap: 6200000000, volatility: 0.00032, icon: '', iconPath: 'tokens/dot.svg', coingeckoId: 'polkadot', verified: true },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', chain: 'Ethereum', price: 11.5, change24h: 1.5, marketCap: 7200000000, volatility: 0.00028, icon: '', iconPath: 'tokens/link.svg', coingeckoId: 'chainlink', verified: true },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', chain: 'Ethereum', price: 6.8, change24h: -0.3, marketCap: 4100000000, volatility: 0.00035, icon: '', iconPath: 'tokens/uni.svg', coingeckoId: 'uniswap', verified: true },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', chain: 'Ethereum', price: 135, change24h: 3.2, marketCap: 2100000000, volatility: 0.0004, icon: '', iconPath: 'tokens/aave.svg', coingeckoId: 'aave', verified: true },
];

// Helper to get full icon URL with base path
export function getTokenIconUrl(iconPath: string): string {
  const base = import.meta.env.BASE_URL || '/orbitt-vault/';
  return `${base}${iconPath}`;
}

export const SUPPORTED_ASSETS: Token[] = assetSeeds.map(asset => ({
  ...asset,
  icon: getTokenIconUrl(asset.iconPath),
  marketPrice: asset.price,
  priceSource: 'CoinGecko',
  priceRetrievedAt: SNAPSHOT_RETRIEVED_AT,
  priceMode: 'market',
}));

export const ICON_LICENSE = 'CoinMarketCap CDN for token icons; Web3icons core branded icons (MIT) for local fallbacks. Cryptocurrency marks remain the property of their respective projects.';

// Token icon paths for local fallbacks (SVG files in public/tokens/)
export const TOKEN_ICON_MAP: Record<string, string> = {
  SOL: 'tokens/sol.svg',
  USDC: 'tokens/usdc.svg',
  WIF: 'tokens/wif.svg',
  JUP: 'tokens/jup.svg',
  PENGU: 'tokens/pengu.svg',
  BONK: 'tokens/bonk.svg',
  ETH: 'tokens/eth.svg',
  BTC: 'tokens/btc.svg',
  USELESS: 'tokens/useless.svg',
  CATE: 'tokens/cate.svg',
  BUTTCOIN: 'tokens/buttcoin.svg',
  GOAT: 'tokens/goat.svg',
  PANTS: 'tokens/pants.svg',
  STONK: 'tokens/stonk.svg',
  EYE: 'tokens/eye.svg',
  USDT: 'tokens/usdt.svg',
  WETH: 'tokens/weth.svg',
  ARB: 'tokens/arb.svg',
  OP: 'tokens/op.svg',
  MATIC: 'tokens/matic.svg',
  AVAX: 'tokens/avax.svg',
  DOT: 'tokens/dot.svg',
  LINK: 'tokens/link.svg',
  UNI: 'tokens/uni.svg',
  AAVE: 'tokens/aave.svg',
};