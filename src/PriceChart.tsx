import React, { useMemo } from 'react';
import { LineChart as PhantomLineChart, MiniLine, type OHLCPoint, type TimeframeKey } from './phantom/charts/LineChart';
import { chartTime, TIMEFRAMES, type TimeframeKey as TFKey } from './phantom/charts/ChartTime';
import type { ChartPeriod, Settings } from './types';
import { toDisplayCurrency } from './logic';

type Props = {
  values: number[];
  currency: Settings['currency'];
  settings: Settings;
  symbol?: string;
  period?: ChartPeriod;
  onPeriodChange?: (period: ChartPeriod) => void;
  height?: number;
  periods?: ChartPeriod[];
  // For phantom charts
  ohlcData?: OHLCPoint[];
  currentPrice?: number;
  candleMode?: boolean;
  onCandleModeChange?: (enabled: boolean) => void;
  timeframe?: TFKey;
  onTimeframeChange?: (tf: TFKey) => void;
};

const PERIOD_TO_TIMEFRAME: Record<ChartPeriod, TFKey> = {
  '1H': 'LIVE',
  '24H': '1D',
  '1D': '1D',
  '1W': '1W',
  '1M': '1M',
  '1Y': '1Y',
  'ALL': 'ALL',
  'LIVE': 'LIVE',
};

function convertToOHLC(values: number[], period: ChartPeriod): OHLCPoint[] {
  const now = Date.now();
  const daysMap: Record<ChartPeriod, number> = {
    '1H': 1/24,
    '24H': 1,
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '1Y': 365,
    'ALL': 365 * 5,
    'LIVE': 1/24,
  };
  const days = daysMap[period] || 1;
  const intervalMs = (days * 24 * 60 * 60 * 1000) / Math.max(1, values.length - 1);

  return values.map((value, index) => {
    const t = now - (values.length - 1 - index) * intervalMs;
    return { t, o: value, h: value, l: value, c: value };
  });
}

export default function PriceChart({
  values,
  currency,
  settings,
  symbol,
  period,
  onPeriodChange,
  height = 132,
  periods,
  ohlcData,
  currentPrice,
  candleMode = false,
  onCandleModeChange,
  timeframe,
  onTimeframeChange,
}: Props) {
  const tf = useMemo(() => {
    if (timeframe) return timeframe;
    if (period) return PERIOD_TO_TIMEFRAME[period];
    return '1D';
  }, [timeframe, period]);

  const data = useMemo(() => {
    if (ohlcData?.length) return ohlcData;
    if (!values.length) return [];
    return convertToOHLC(values, period || '1D');
  }, [ohlcData, values, period]);

  const color = useMemo(() => {
    if (data.length < 2) return 'up' as const;
    const first = data[0].c;
    const last = data[data.length - 1].c;
    return last >= first ? 'up' : 'down';
  }, [data]);

  const handleTimeframeChange = (newTf: TFKey) => {
    onTimeframeChange?.(newTf);
    if (period && onPeriodChange) {
      const reverseMap: Record<TFKey, ChartPeriod> = {
        'LIVE': 'LIVE',
        '1D': '1D',
        '1W': '1W',
        '1M': '1M',
        '1Y': '1Y',
        'ALL': 'ALL',
      };
      onPeriodChange(reverseMap[newTf] || '1D');
    }
  };

  if (!data.length) {
    return (
      <div className="chart-block" style={{ height }}>
        <div className="line-chart" style={{ height }} role="img" aria-label="Price history unavailable">
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
            Price history unavailable for this time range
          </div>
        </div>
        {onPeriodChange && period && (
          <div className="chart-periods" role="tablist" aria-label="Chart time period">
            {(periods ?? ['1H', '24H', '1W', '1M', '1Y', 'ALL']).map(choice => (
              <button
                key={choice}
                role="tab"
                aria-selected={period === choice}
                className={period === choice ? 'is-active' : ''}
                onClick={() => onPeriodChange(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chart-block">
      <PhantomLineChart
        data={data}
        timeframe={tf}
        onTimeframeChange={handleTimeframeChange}
        candleMode={candleMode}
        onCandleModeChange={onCandleModeChange}
        color={color}
        height={height}
        showCurrentPrice={!!currentPrice && !!symbol}
        currentPrice={currentPrice}
      />
    </div>
  );
}

// Export MiniLine for other uses
export { MiniLine } from './phantom/charts/LineChart';