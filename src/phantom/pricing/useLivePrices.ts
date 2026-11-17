import { useState, useEffect, useCallback, useRef } from 'react';

interface LivePrice {
  price: number;
  chg: number;
  updatedAt: number;
}

interface LivePricesState {
  prices: Record<string, LivePrice>;
  loading: boolean;
  error: string | null;
}

const COINGECKO_IDS: Record<string, string> = {
  SOL: 'solana',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDC: 'usd-coin',
  USDT: 'tether',
  WETH: 'weth',
  JUP: 'jupiter-exchange-solana',
  WIF: 'dogwifcoin',
  BONK: 'bonk',
  PENGU: 'pudgy-penguins',
  ARB: 'arbitrum',
  OP: 'optimism',
  MATIC: 'matic-network',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
};

const DEXSCREENER_CHAINS: Record<string, string> = {
  SOL: 'solana',
};

export function useLivePrices(symbols: string[], intervalMs = 15000) {
  const [state, setState] = useState<LivePricesState>({
    prices: {},
    loading: true,
    error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const fetchPrices = useCallback(async () => {
    const coingeckoSymbols = symbols.filter(s => COINGECKO_IDS[s.toUpperCase()]);
    const dexSymbols = symbols.filter(s => DEXSCREENER_CHAINS[s.toUpperCase()]);

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const results: Record<string, LivePrice> = {};

      if (coingeckoSymbols.length > 0) {
        const ids = coingeckoSymbols.map(s => COINGECKO_IDS[s.toUpperCase()]).join(',');
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          for (const coin of data) {
            const symbol = coingeckoSymbols.find(s => COINGECKO_IDS[s.toUpperCase()] === coin.id);
            if (symbol) {
              results[symbol.toUpperCase()] = {
                price: coin.current_price,
                chg: coin.price_change_percentage_24h || 0,
                updatedAt: Date.now(),
              };
            }
          }
        }
      }

      if (dexSymbols.length > 0) {
        for (const symbol of dexSymbols) {
          try {
            const chain = DEXSCREENER_CHAINS[symbol.toUpperCase()];
            const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${symbol}`);
            if (response.ok) {
              const data = await response.json();
              if (data.pairs && data.pairs.length > 0) {
                const pair = data.pairs[0];
                results[symbol.toUpperCase()] = {
                  price: parseFloat(pair.priceUsd) || 0,
                  chg: pair.priceChange?.h24 || 0,
                  updatedAt: Date.now(),
                };
              }
            }
          } catch {
            // Ignore individual token errors
          }
        }
      }

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          prices: { ...prev.prices, ...results },
          loading: false,
        }));
      }
    } catch (err) {
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch prices',
        }));
      }
    }
  }, [symbols]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPrices();

    intervalRef.current = setInterval(fetchPrices, intervalMs);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrices, intervalMs]);

  const getPrice = useCallback((symbol: string): LivePrice | null => {
    return state.prices[symbol.toUpperCase()] || null;
  }, [state.prices]);

  return { ...state, getPrice, refetch: fetchPrices };
}

export function useLivePrice(symbol: string, intervalMs = 15000) {
  const { prices, loading, error, refetch } = useLivePrices([symbol], intervalMs);
  return {
    price: prices[symbol.toUpperCase()]?.price ?? 0,
    chg: prices[symbol.toUpperCase()]?.chg ?? 0,
    loading,
    error,
    refetch,
  };
}