import { Signal, MarketData } from '@/types/trading';

const ALL_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'USD/CHF',
  'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'EUR/AUD', 'GBP/AUD', 'EUR/CAD',
  'BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD', 'BCH/USD', 'BNB/USD', 'ADA/USD',
  'DOGE/USD', 'SOL/USD', 'DOT/USD', 'MATIC/USD', 'LINK/USD', 'UNI/USD',
  'XAU/USD', 'XAG/USD', 'OIL/USD', 'GAS/USD'
];

const analyzeSignalQuality = (indicators: any, marketConditions: any): number => {
  const rsiStrength = Math.abs(indicators.rsi - 50) / 50;
  const macdStrength = Math.abs(indicators.macd);
  const emaAlignment = indicators.ema;
  const bollingerPosition = indicators.bollinger;
  
  const trendAlignment = marketConditions.momentum > 0 ? 
    (indicators.rsi > 50 ? 1 : 0.3) : 
    (indicators.rsi < 50 ? 1 : 0.3);
  
  const volumeConfirmation = marketConditions.volume > 1000000 ? 1 : 0.7;
  const volatilityOptimal = marketConditions.volatility > 0.5 && marketConditions.volatility < 1.5 ? 1 : 0.6;
  
  const technicalScore = (
    rsiStrength * 0.25 +
    macdStrength * 0.2 +
    emaAlignment * 0.2 +
    bollingerPosition * 0.15 +
    trendAlignment * 0.1 +
    volumeConfirmation * 0.05 +
    volatilityOptimal * 0.05
  );
  
  return technicalScore;
};

export const generateSignals = (marketType: 'classic' | 'otc' | 'all'): Signal[] => {
  const signals: Signal[] = [];
  const now = Date.now();
  
  const marketConditions = ALL_PAIRS.map(pair => ({
    pair,
    volume: 500000 + Math.random() * 2500000,
    volatility: 0.3 + Math.random() * 1.5,
    momentum: Math.random() * 2 - 1,
    strength: 50 + Math.random() * 50,
  }));

  ALL_PAIRS.forEach((pair, idx) => {
    const isClassic = idx % 3 !== 0;
    const market = isClassic ? 'classic' : 'otc';
    
    if (marketType !== 'all' && market !== marketType) return;

    const rsi = 20 + Math.random() * 60;
    const macd = -1 + Math.random() * 2;
    const ema = Math.random();
    const bollinger = Math.random();
    
    const indicators = {
      rsi: Math.round(rsi * 10) / 10,
      macd: Math.round(macd * 100) / 100,
      ema: Math.round(ema * 100) / 100,
      bollinger: Math.round(bollinger * 100) / 100,
    };
    
    const conditions = marketConditions[idx];
    const qualityScore = analyzeSignalQuality(indicators, conditions);
    
    const baseProbability = 70;
    const probability = Math.min(98, Math.max(75, Math.round(baseProbability + qualityScore * 28)));
    
    if (probability >= 80) {
      const confidence = probability >= 92 ? 'high' : probability >= 86 ? 'medium' : 'low';
      
      const direction = rsi < 35 ? 'CALL' : rsi > 65 ? 'PUT' : (macd > 0 ? 'CALL' : 'PUT');
      
      const strategies = [
        'AI Multi-Factor',
        'RSI Divergence + MACD',
        'Smart Bollinger Breakout',
        'EMA Crossover Pro',
        'Volume Surge Detection',
        'Trend Momentum Fusion',
        'Support/Resistance AI',
        'Pattern Recognition Pro'
      ];
      
      signals.push({
        id: `signal-${now}-${idx}`,
        pair,
        direction,
        expiration: probability >= 90 ? '1м' : probability >= 85 ? '2м' : '3м',
        probability,
        timeToOpen: Math.floor(Math.random() * 120) + 5,
        status: probability >= 88 ? 'active' : 'waiting',
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
        market,
        indicators,
        confidence,
        timestamp: now,
      });
    }
  });

  return signals
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 15);
};

export const generateMarketData = (marketType: 'classic' | 'otc' | 'all'): MarketData[] => {
  const topPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'BTC/USD', 'ETH/USD',
    'XAU/USD', 'EUR/GBP', 'GBP/JPY', 'XRP/USD', 'LTC/USD', 'SOL/USD'
  ];

  return topPairs.map(pair => {
    const baseStrength = 60 + Math.random() * 40;
    const trendValue = baseStrength / 100;
    const trend = trendValue > 0.7 ? 'up' : trendValue < 0.5 ? 'down' : 'neutral';
    
    const momentum = trend === 'up' ? 0.5 + Math.random() * 0.5 : 
                     trend === 'down' ? -0.5 - Math.random() * 0.5 : 
                     Math.random() * 0.4 - 0.2;
    
    return {
      pair,
      trend,
      volume: Math.floor(800000 + Math.random() * 2200000),
      volatility: Math.round((0.4 + Math.random() * 1.1) * 100) / 100,
      strength: Math.round(baseStrength),
      momentum: Math.round(momentum * 100) / 100,
      support: Math.round((1.05 + Math.random() * 0.15) * 10000) / 10000,
      resistance: Math.round((1.15 + Math.random() * 0.15) * 10000) / 10000,
    };
  });
};

export const calculateSignalStrength = (signal: Signal): number => {
  const { indicators, probability, confidence } = signal;
  
  const rsiScore = Math.abs(50 - indicators.rsi) / 50;
  const macdScore = Math.min(1, Math.abs(indicators.macd));
  const emaScore = indicators.ema;
  const bollingerScore = indicators.bollinger;
  
  const technicalScore = (rsiScore * 0.3 + macdScore * 0.25 + emaScore * 0.25 + bollingerScore * 0.2);
  const probabilityScore = probability / 100;
  const confidenceBonus = confidence === 'high' ? 0.15 : confidence === 'medium' ? 0.08 : 0;
  
  return Math.round((technicalScore * 0.35 + probabilityScore * 0.5 + confidenceBonus) * 100);
};

export const getProfitPotential = (signal: Signal): string => {
  if (signal.probability >= 95) return 'Очень высокий';
  if (signal.probability >= 90) return 'Высокий';
  if (signal.probability >= 85) return 'Хороший';
  return 'Средний';
};

export const getRecommendedAmount = (balance: number, probability: number): number => {
  if (probability >= 95) return balance * 0.05;
  if (probability >= 90) return balance * 0.04;
  if (probability >= 85) return balance * 0.03;
  return balance * 0.02;
};
