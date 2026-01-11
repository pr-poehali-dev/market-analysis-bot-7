import { Signal, MarketData } from '@/types/trading';

export const generateSignals = (marketType: 'classic' | 'otc' | 'all'): Signal[] => {
  const pairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
    'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'BTC/USD', 'ETH/USD',
    'XRP/USD', 'LTC/USD', 'ADA/USD', 'DOGE/USD'
  ];

  const signals: Signal[] = [];
  const now = Date.now();

  pairs.forEach((pair, idx) => {
    const isClassic = Math.random() > 0.4;
    const market = isClassic ? 'classic' : 'otc';
    
    if (marketType !== 'all' && market !== marketType) return;

    const rsi = 30 + Math.random() * 40;
    const macd = -0.5 + Math.random() * 1;
    const ema = 0.3 + Math.random() * 0.4;
    const bollinger = 0.2 + Math.random() * 0.6;

    const indicatorScore = (
      (rsi > 50 ? rsi - 50 : 50 - rsi) / 50 * 0.3 +
      Math.abs(macd) * 0.2 +
      ema * 0.25 +
      bollinger * 0.25
    );

    const probability = Math.min(95, Math.max(65, Math.round(70 + indicatorScore * 25)));
    
    const confidence = probability >= 85 ? 'high' : probability >= 75 ? 'medium' : 'low';

    if (Math.random() > 0.3) {
      signals.push({
        id: `signal-${now}-${idx}`,
        pair,
        direction: rsi > 50 ? 'CALL' : 'PUT',
        expiration: ['1м', '2м', '3м', '5м'][Math.floor(Math.random() * 4)],
        probability,
        timeToOpen: Math.floor(Math.random() * 180),
        status: Math.random() > 0.7 ? 'active' : 'waiting',
        strategy: ['RSI + MACD', 'Bollinger + EMA', 'Price Action', 'Volume Analysis'][Math.floor(Math.random() * 4)],
        market,
        indicators: {
          rsi: Math.round(rsi * 10) / 10,
          macd: Math.round(macd * 100) / 100,
          ema: Math.round(ema * 100) / 100,
          bollinger: Math.round(bollinger * 100) / 100,
        },
        confidence,
        timestamp: now,
      });
    }
  });

  return signals.sort((a, b) => b.probability - a.probability);
};

export const generateMarketData = (marketType: 'classic' | 'otc' | 'all'): MarketData[] => {
  const pairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
    'EUR/GBP', 'BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD'
  ];

  return pairs.map(pair => {
    const trendValue = Math.random();
    const trend = trendValue > 0.6 ? 'up' : trendValue < 0.4 ? 'down' : 'neutral';
    const strength = Math.round((0.5 + Math.random() * 0.5) * 100);
    
    return {
      pair,
      trend,
      volume: Math.floor(500000 + Math.random() * 2000000),
      volatility: Math.round((0.3 + Math.random() * 1.2) * 100) / 100,
      strength,
      momentum: Math.round((Math.random() * 2 - 1) * 100) / 100,
      support: Math.round((1.1 + Math.random() * 0.1) * 10000) / 10000,
      resistance: Math.round((1.15 + Math.random() * 0.1) * 10000) / 10000,
    };
  });
};

export const calculateSignalStrength = (signal: Signal): number => {
  const { indicators, probability } = signal;
  
  const rsiScore = Math.abs(50 - indicators.rsi) / 50;
  const macdScore = Math.abs(indicators.macd);
  const emaScore = indicators.ema;
  const bollingerScore = indicators.bollinger;
  
  const technicalScore = (rsiScore * 0.3 + macdScore * 0.25 + emaScore * 0.25 + bollingerScore * 0.2);
  const probabilityScore = probability / 100;
  
  return Math.round((technicalScore * 0.4 + probabilityScore * 0.6) * 100);
};
