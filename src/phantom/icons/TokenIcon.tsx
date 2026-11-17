import React, { useState, useEffect } from 'react';
import { getTokenIconUrl, getTokenBySymbol, LOCAL_ICONS } from './tokenIcons';

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export const TokenIcon: React.FC<TokenIconProps> = ({
  symbol,
  size = 32,
  className = '',
  fallback,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImageError(false);
    setLoaded(false);

    const token = getTokenBySymbol(symbol);
    const url = token?.coinmarketcapId ? getTokenIconUrl(symbol) : null;

    if (url) {
      setImageSrc(url);
    } else if (LOCAL_ICONS[symbol.toUpperCase()]) {
      setImageSrc(`data:image/svg+xml;base64,${btoa(LOCAL_ICONS[symbol.toUpperCase()])}`);
    } else {
      setImageError(true);
    }
  }, [symbol]);

  if (loaded && !imageError && imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={symbol}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setImageError(true)}
      />
    );
  }

  if (imageError || !imageSrc) {
    return (
      <div
        className={`w-${size} h-${size} rounded-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 ${className}`}
        style={{ width: size, height: size }}
      >
        {fallback || (
          <span className="text-white font-bold text-xs uppercase">
            {symbol.slice(0, 3)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export const NetworkLogo: React.FC<{ symbol: string; size?: number; className?: string }> = ({
  symbol,
  size = 32,
  className = '',
}) => {
  return <TokenIcon symbol={symbol} size={size} className={className} />;
};