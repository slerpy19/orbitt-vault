import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { chartTime, TIMEFRAMES, type TimeframeKey } from './ChartTime';

export type { TimeframeKey };
export interface OHLCPoint {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

interface LineChartProps {
  data: OHLCPoint[];
  timeframe: TimeframeKey;
  onTimeframeChange: (tf: TimeframeKey) => void;
  onScrub?: (point: OHLCPoint | null) => void;
  scrubIndex?: number;
  candleMode?: boolean;
  onCandleModeChange?: (enabled: boolean) => void;
  color?: 'up' | 'down';
  height?: number;
  showGrid?: boolean;
  showCurrentPrice?: boolean;
  currentPrice?: number;
}

const W = 393;
const H = 250;
const PADDING_LEFT = 48;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 40;
const CHART_W = W - PADDING_LEFT - PADDING_RIGHT;
const CHART_H = H - PADDING_TOP - PADDING_BOTTOM;

const COLORS = {
  up: '#00D47E',
  down: '#FF4757',
  grid: '#2A2A2A',
  text: '#B4B4B4',
  axis: '#3A3A3A',
  scrubLine: '#FFFFFF',
  scrubCircle: '#FFFFFF',
  scrubText: '#EEEEF0',
  currentPriceLine: '#00D47E',
  currentPriceText: '#00D47E',
};

function normalizeHistory(rows: OHLCPoint[]): OHLCPoint[] {
  if (!Array.isArray(rows)) return [];
  const points = new Map<number, OHLCPoint>();
  for (const row of rows) {
    if (!row || typeof row.t !== 'number' || typeof row.o !== 'number' ||
        typeof row.h !== 'number' || typeof row.l !== 'number' || typeof row.c !== 'number') {
      continue;
    }
    if (row.t <= 0 || Math.min(row.o, row.h, row.l, row.c) <= 0 ||
        row.h < Math.max(row.o, row.c) || row.l > Math.min(row.o, row.c) || row.h < row.l) {
      continue;
    }
    points.set(row.t, row);
  }
  return [...points.values()].sort((a, b) => a.t - b.t);
}

function getPriceRange(data: OHLCPoint[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 1 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of data) {
    min = Math.min(min, p.l);
    max = Math.max(max, p.h);
  }
  const padding = (max - min) * 0.1;
  return { min: min - padding, max: max + padding };
}

function xScale(data: OHLCPoint[], index: number): number {
  if (data.length <= 1) return PADDING_LEFT + CHART_W / 2;
  return PADDING_LEFT + (index / (data.length - 1)) * CHART_W;
}

function yScale(price: number, range: { min: number; max: number }): number {
  const { min, max } = range;
  if (max === min) return PADDING_TOP + CHART_H / 2;
  return PADDING_TOP + CHART_H - ((price - min) / (max - min)) * CHART_H;
}

export const LineChart: React.FC<LineChartProps> = ({
  data: rawData,
  timeframe,
  onTimeframeChange,
  onScrub,
  scrubIndex,
  candleMode = false,
  onCandleModeChange,
  color = 'up',
  height = 250,
  showGrid = true,
  showCurrentPrice = false,
  currentPrice,
}) => {
  const data = useMemo(() => normalizeHistory(rawData), [rawData]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [localScrubIndex, setLocalScrubIndex] = useState<number | null>(null);
  const priceRange = useMemo(() => getPriceRange(data), [data]);

  const activeIndex = scrubIndex ?? localScrubIndex;
  const activePoint = activeIndex !== null && data[activeIndex] ? data[activeIndex] : null;

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current || data.length === 0) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relX = (x - PADDING_LEFT) / CHART_W;
    const index = Math.round(Math.max(0, Math.min(data.length - 1, relX * (data.length - 1))));

    setLocalScrubIndex(index);
    setIsScrubbing(true);
    onScrub?.(data[index]);
  }, [data, onScrub]);

  const handlePointerLeave = useCallback(() => {
    setLocalScrubIndex(null);
    setIsScrubbing(false);
    onScrub?.(null);
  }, [onScrub]);

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e);
  }, [handlePointerMove]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsScrubbing(false);
  }, []);

  const mainColor = COLORS[color];

  if (data.length === 0) {
    return (
      <svg width={W} height={height} viewBox={`0 0 ${W} ${H}`} className="bg-gray-900 rounded-xl">
        {showGrid && (
          <>
            <line x1={PADDING_LEFT} y1={PADDING_TOP} x2={PADDING_LEFT} y2={PADDING_TOP + CHART_H} stroke={COLORS.axis} strokeWidth={1} />
            <line x1={PADDING_LEFT} y1={PADDING_TOP + CHART_H} x2={W - PADDING_RIGHT} y2={PADDING_TOP + CHART_H} stroke={COLORS.axis} strokeWidth={1} />
            <line x1={PADDING_LEFT} y1={PADDING_TOP + CHART_H / 2} x2={W - PADDING_RIGHT} y2={PADDING_TOP + CHART_H / 2} stroke={COLORS.grid} strokeWidth={1} strokeDasharray="4 4" />
          </>
        )}
        <text x={W / 2} y={H / 2} textAnchor="middle" fill={COLORS.text} fontSize={14}>
          Price history unavailable for this time range
        </text>
      </svg>
    );
  }

  const pathData = data.map((p, i) => {
    const x = xScale(data, i);
    const y = yScale(p.c, priceRange);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaPathData = data.map((p, i) => {
    const x = xScale(data, i);
    const y = yScale(p.c, priceRange);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ` L${xScale(data, data.length - 1)} ${PADDING_TOP + CHART_H} L${PADDING_LEFT} ${PADDING_TOP + CHART_H} Z`;

  const candleElements = data.map((p, i) => {
    const x = xScale(data, i);
    const isUp = p.c >= p.o;
    const candleColor = isUp ? COLORS.up : COLORS.down;
    const w = Math.max(1, CHART_W / data.length * 0.6);
    const bodyTop = yScale(Math.max(p.o, p.c), priceRange);
    const bodyBottom = yScale(Math.min(p.o, p.c), priceRange);
    const bodyHeight = Math.max(1, bodyBottom - bodyTop);

    return (
      <g key={p.t}>
        <line
          x1={x}
          y1={yScale(p.h, priceRange)}
          x2={x}
          y2={yScale(p.l, priceRange)}
          stroke={candleColor}
          strokeWidth={1}
        />
        <rect
          x={x - w / 2}
          y={bodyTop}
          width={w}
          height={bodyHeight}
          fill={candleColor}
        />
      </g>
    );
  });

  const currentPriceY = currentPrice && showCurrentPrice
    ? yScale(currentPrice, priceRange)
    : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={W}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        className="bg-gray-900 rounded-xl touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerOut={handlePointerLeave}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={mainColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {showGrid && (
          <>
            <line x1={PADDING_LEFT} y1={PADDING_TOP} x2={PADDING_LEFT} y2={PADDING_TOP + CHART_H} stroke={COLORS.axis} strokeWidth={1} />
            <line x1={PADDING_LEFT} y1={PADDING_TOP + CHART_H} x2={W - PADDING_RIGHT} y2={PADDING_TOP + CHART_H} stroke={COLORS.axis} strokeWidth={1} />
            <line x1={PADDING_LEFT} y1={PADDING_TOP + CHART_H / 2} x2={W - PADDING_RIGHT} y2={PADDING_TOP + CHART_H / 2} stroke={COLORS.grid} strokeWidth={1} strokeDasharray="4 4" />
          </>
        )}

        {!candleMode && (
          <>
            <path d={areaPathData} fill="url(#areaGradient)" />
            <path d={pathData} fill="none" stroke={mainColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {candleMode && <g>{candleElements}</g>}

        {currentPriceY !== null && currentPrice !== null && currentPrice !== undefined && (
          <>
            <line
              x1={PADDING_LEFT}
              y1={currentPriceY}
              x2={W - PADDING_RIGHT}
              y2={currentPriceY}
              stroke={COLORS.currentPriceLine}
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.6}
            />
            <text
              x={W - PADDING_RIGHT - 4}
              y={currentPriceY - 4}
              textAnchor="end"
              fill={COLORS.currentPriceText}
              fontSize={10}
              fontWeight={600}
            >
              {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </text>
          </>
        )}

        {activePoint && !candleMode && (
          <>
            <line
              x1={xScale(data, data.indexOf(activePoint))}
              y1={PADDING_TOP}
              x2={xScale(data, data.indexOf(activePoint))}
              y2={PADDING_TOP + CHART_H}
              stroke={COLORS.scrubLine}
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.5}
            />
            <circle
              cx={xScale(data, data.indexOf(activePoint))}
              cy={yScale(activePoint.c, priceRange)}
              r={5}
              fill={COLORS.scrubCircle}
              stroke={mainColor}
              strokeWidth={2}
            />
          </>
        )}

        {activePoint && (
          <text
            x={Math.max(PADDING_LEFT + 20, Math.min(W - PADDING_RIGHT - 20, xScale(data, data.indexOf(activePoint))))}
            y={PADDING_TOP + 14}
            textAnchor="middle"
            fill={COLORS.scrubText}
            fontSize={11}
            fontWeight={600}
            fontFamily="system-ui, sans-serif"
          >
            {chartTime(activePoint.t, timeframe)}
          </text>
        )}
      </svg>

      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => onTimeframeChange(tf.key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeframe === tf.key
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {onCandleModeChange && (
          <button
            onClick={() => onCandleModeChange(!candleMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              candleMode
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {candleMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15c2.5-4 4.5-2 6-4s3-6 6-7" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14h8" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h4" />
                </>
              )}
            </svg>
            {candleMode ? 'Line' : 'Candles'}
          </button>
        )}
      </div>
    </div>
  );
};

export const MiniLine: React.FC<{
  data: OHLCPoint[];
  color?: 'up' | 'down';
  width?: number;
  height?: number;
}> = ({ data, color = 'up', width = 74, height = 30 }) => {
  const normalized = useMemo(() => normalizeHistory(data), [data]);

  if (normalized.length === 0) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect width={width} height={height} fill="transparent" />
      </svg>
    );
  }

  const mainColor = COLORS[color];
  const prices = normalized.map(p => p.c);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = normalized.map((p, i) => {
    const x = (i / (normalized.length - 1)) * width;
    const y = height - ((p.c - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={mainColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};