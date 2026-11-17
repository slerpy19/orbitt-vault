import { PHANTOM_TOKENS, type TokenIconConfig } from '../icons/tokenIcons';

export const SUPPORTED_TOKENS: TokenIconConfig[] = PHANTOM_TOKENS;

export function getTokenConfig(symbol: string): TokenIconConfig | undefined {
  return PHANTOM_TOKENS.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getAllSymbols(): string[] {
  return PHANTOM_TOKENS.map(t => t.symbol);
}

export function getVerifiedSymbols(): string[] {
  return PHANTOM_TOKENS.filter(t => t.verified).map(t => t.symbol);
}

export function getTokensByNetwork(network: TokenIconConfig['network']): TokenIconConfig[] {
  return PHANTOM_TOKENS.filter(t => t.network === network);
}

export const TOKEN_CATEGORIES = {
  blueChips: PHANTOM_TOKENS.filter(t => t.verified).map(t => t.symbol),
  memes: PHANTOM_TOKENS.filter(t => !t.verified && t.network === 'solana').map(t => t.symbol),
  ethereum: PHANTOM_TOKENS.filter(t => t.network === 'ethereum').map(t => t.symbol),
  other: PHANTOM_TOKENS.filter(t => t.network === 'other').map(t => t.symbol),
} as const;