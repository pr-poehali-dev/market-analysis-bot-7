import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Signal, MarketData } from '@/types/trading';
import SignalsPanel from '@/components/SignalsPanel';
import RiskManagement from '@/components/RiskManagement';
import TradingTabs from '@/components/TradingTabs';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [riskPercent, setRiskPercent] = useState(2);
  const [balance, setBalance] = useState(1000);

  const [signals, setSignals] = useState<Signal[]>([
    {
      id: '1',
      pair: 'EUR/USD',
      direction: 'CALL',
      expiration: '1м',
      probability: 87,
      timeToOpen: 45,
      status: 'active',
      strategy: 'RSI + MACD',
      market: 'classic',
    },
    {
      id: '2',
      pair: 'GBP/USD',
      direction: 'PUT',
      expiration: '2м',
      probability: 82,
      timeToOpen: 120,
      status: 'waiting',
      strategy: 'Bollinger Bands',
      market: 'otc',
    },
    {
      id: '3',
      pair: 'BTC/USD',
      direction: 'CALL',
      expiration: '3м',
      probability: 91,
      timeToOpen: 30,
      status: 'active',
      strategy: 'EMA Crossover',
      market: 'classic',
    },
  ]);

  const [marketData] = useState<MarketData[]>([
    { pair: 'EUR/USD', trend: 'up', volume: 1250000, volatility: 0.65 },
    { pair: 'GBP/USD', trend: 'down', volume: 980000, volatility: 0.82 },
    { pair: 'USD/JPY', trend: 'neutral', volume: 1100000, volatility: 0.45 },
    { pair: 'BTC/USD', trend: 'up', volume: 2300000, volatility: 1.25 },
  ]);

  const [stats] = useState({
    todayTrades: 24,
    todayProfit: 156.50,
    winRate: 75,
    totalProfit: 2340.80,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (autoUpdate) {
        setSignals(prev =>
          prev.map(signal => ({
            ...signal,
            timeToOpen: signal.timeToOpen > 0 ? signal.timeToOpen - 1 : 0,
          }))
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePositionSize = () => {
    return ((balance * riskPercent) / 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1800px] mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pocket Option Analyzer</h1>
              <p className="text-sm text-muted-foreground">Real-time Market Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Баланс</p>
              <p className="text-xl font-mono font-bold">${balance.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Время МСК</p>
              <p className="text-xl font-mono font-bold">{currentTime.toLocaleTimeString('ru-RU')}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Сделок сегодня</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold">{stats.todayTrades}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Прибыль сегодня</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-primary">+${stats.todayProfit}</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold">{stats.winRate}%</div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Общая прибыль</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-primary">${stats.totalProfit}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="signals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 h-auto">
            <TabsTrigger value="signals" className="gap-2">
              <Icon name="Signal" size={16} />
              Сигналы
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <Icon name="LineChart" size={16} />
              Графики
            </TabsTrigger>
            <TabsTrigger value="strategies" className="gap-2">
              <Icon name="Brain" size={16} />
              Стратегии
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Icon name="Briefcase" size={16} />
              Портфель
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="indicators" className="gap-2">
              <Icon name="Activity" size={16} />
              Индикаторы
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="History" size={16} />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signals" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <SignalsPanel signals={signals} formatTime={formatTime} />
              </div>

              <RiskManagement
                riskPercent={riskPercent}
                setRiskPercent={setRiskPercent}
                balance={balance}
                setBalance={setBalance}
                calculatePositionSize={calculatePositionSize}
                marketData={marketData}
              />
            </div>
          </TabsContent>

          <TradingTabs autoUpdate={autoUpdate} setAutoUpdate={setAutoUpdate} />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
