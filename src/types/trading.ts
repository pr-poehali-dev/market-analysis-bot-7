export interface Signal {
  id: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  expiration: string;
  probability: number;
  timeToOpen: number;
  status: 'active' | 'waiting' | 'closed';
  profit?: number;
  strategy: string;
  market: 'classic' | 'otc';
  indicators: {
    rsi: number;
    macd: number;
    ema: number;
    bollinger: number;
  };
  confidence: 'high' | 'medium' | 'low';
  timestamp: number;
}

export interface MarketData {
  pair: string;
  trend: 'up' | 'down' | 'neutral';
  volume: number;
  volatility: number;
  strength: number;
  momentum: number;
  support: number;
  resistance: number;
}

export interface Trade {
  id: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  openTime: string;
  closeTime?: string;
  expiration: string;
  amount: number;
  profit: number;
  status: 'open' | 'win' | 'loss';
  market: 'classic' | 'otc';
}

export interface Strategy {
  name: string;
  description: string;
  winRate: number;
  totalTrades: number;
  avgProfit: number;
  enabled: boolean;
  parameters: Record<string, number>;
}