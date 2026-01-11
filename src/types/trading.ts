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
}

export interface MarketData {
  pair: string;
  trend: 'up' | 'down' | 'neutral';
  volume: number;
  volatility: number;
}
