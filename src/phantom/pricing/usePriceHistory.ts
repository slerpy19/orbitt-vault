import { useState, useEffect, useCallback } from 'react';
import type { OHLCPoint } from '../../phantom/charts/LineChart';
import { TIMEFRAMES, type TimeframeKey } from '../../phantom/charts/ChartTime';

interface PriceHistoryState {
  data: OHLCPoint[];
  loading: boolean;
  error: string | null;
}

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

function coingeckoIdForSymbol(symbol: string): string | null {
  const map: Record<string, string> = {
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
  return map[symbol.toUpperCase()] || null;
}

export function usePriceHistory(symbol: string, timeframe: TimeframeKey = '1D') {
  const [state, setState] = useState<PriceHistoryState>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchHistory = useCallback(async () => {
    const id = coingeckoIdForSymbol(symbol);
    if (!id) {
      setState({ data: [], loading: false, error: 'Unsupported token' });
      return;
    }

    const tf = TIMEFRAMES.find(t => t.key === timeframe);
    const days = tf?.days === 'max' ? 'max' : tf?.days || 1;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let url: string;
      if (days === 'max') {
        url = `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=max`;
      } else {
        url = `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch price history');

      const json = await response.json();
      const prices = json.prices || [];

      const points: OHLCPoint[] = prices
        .filter((row: unknown) => Array.isArray(row) && row.length >= 2 && Number.isFinite(row[0]) && Number.isFinite(row[1]) && row[1] > 0)
        .map((row: [number, number]) => ({
          t: row[0],
          o: row[1],
          h: row[1],
          l: row[1],
          c: row[1],
        }));

      setState({ data: points, loading: false, error: null });
    } catch (err) {
      setState({ data: [], loading: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { ...state, refetch: fetchHistory };
}

export function useOHLCHistory(symbol: string, timeframe: TimeframeKey = '1D') {
  const [state, setState] = useState<PriceHistoryState>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchOHLC = useCallback(async () => {
    const id = coingeckoIdForSymbol(symbol);
    if (!id) {
      setState({ data: [], loading: false, error: 'Unsupported token' });
      return;
    }

    const tf = TIMEFRAMES.find(t => t.key === timeframe);
    const days = tf?.days === 'max' ? 'max' : tf?.days || 1;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const url = `${COINGECKO_BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch OHLC data');

      const ohlc = await response.json();

      const points: OHLCPoint[] = (ohlc || [])
        .filter((row: unknown) => Array.isArray(row) && row.length >= 5 && row.slice(0, 5).every(Number.isFinite))
        .map((row: number[]) => ({
          t: row[0],
          o: row[1],
          h: row[2],
          l: row[3],
          c: row[4],
        }));

      setState({ data: points, loading: false, error: null });
    } catch (err) {
      setState({ data: [], loading: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchOHLC();
  }, [fetchOHLC]);

  return { ...state, refetch: fetchOHLC };
}