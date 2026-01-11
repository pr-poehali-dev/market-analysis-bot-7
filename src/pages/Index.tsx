import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Signal, MarketData, Trade } from '@/types/trading';
import TradingTabs from '@/components/TradingTabs';
import MarketSelector from '@/components/MarketSelector';
import ActiveTrades from '@/components/ActiveTrades';
import ProfitableSignals from '@/components/ProfitableSignals';
import MarketAnalysis from '@/components/MarketAnalysis';
import { generateSignals, generateMarketData } from '@/utils/signalGenerator';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [balance, setBalance] = useState(10000);
  const [selectedMarket, setSelectedMarket] = useState<'classic' | 'otc' | 'all'>('all');

  const [signals, setSignals] = useState<Signal[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const [stats, setStats] = useState({
    todayTrades: 0,
    todayProfit: 0,
    winRate: 0,
    totalProfit: 0,
  });

  const regenerateSignals = useCallback(() => {
    const newSignals = generateSignals(selectedMarket);
    setSignals(newSignals);
  }, [selectedMarket]);

  const regenerateMarketData = useCallback(() => {
    const newMarketData = generateMarketData(selectedMarket);
    setMarketData(newMarketData);
  }, [selectedMarket]);

  useEffect(() => {
    regenerateSignals();
    regenerateMarketData();
  }, [regenerateSignals, regenerateMarketData]);

  useEffect(() => {
    const signalTimer = setInterval(() => {
      regenerateSignals();
    }, 1000);

    return () => clearInterval(signalTimer);
  }, [regenerateSignals]);

  useEffect(() => {
    const marketTimer = setInterval(() => {
      regenerateMarketData();
    }, 1000);

    return () => clearInterval(marketTimer);
  }, [regenerateMarketData]);

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

        setTrades(prev => {
          const updated = prev.map(trade => {
            if (trade.status === 'open') {
              const openDate = new Date(trade.openTime);
              const expirationMinutes = parseInt(trade.expiration);
              const closeDate = new Date(openDate.getTime() + expirationMinutes * 60000);
              
              if (new Date() >= closeDate) {
                const isWin = Math.random() > 0.3;
                const profit = isWin ? trade.amount * 0.8 : -trade.amount;
                
                setBalance(prev => prev + trade.amount + profit);
                
                setStats(prev => ({
                  todayTrades: prev.todayTrades + 1,
                  todayProfit: prev.todayProfit + profit,
                  winRate: Math.round(((prev.todayTrades * prev.winRate / 100 + (isWin ? 1 : 0)) / (prev.todayTrades + 1)) * 100),
                  totalProfit: prev.totalProfit + profit,
                }));

                toast({
                  title: isWin ? '✅ Сделка закрыта в прибыль!' : '❌ Сделка закрыта в убыток',
                  description: `${trade.pair} ${trade.direction}: ${isWin ? '+' : ''}$${profit.toFixed(2)}`,
                  variant: isWin ? 'default' : 'destructive',
                });

                return {
                  ...trade,
                  status: isWin ? 'win' : 'loss',
                  profit,
                  closeTime: new Date().toLocaleTimeString('ru-RU'),
                };
              }
            }
            return trade;
          });
          return updated;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  const handleOpenTrade = (signal: Signal) => {
    const positionSize = (balance * (signal.probability >= 95 ? 0.05 : signal.probability >= 90 ? 0.04 : 0.03));
    
    if (positionSize > balance) {
      toast({
        title: '⚠️ Недостаточно средств',
        description: 'Пополните баланс или уменьшите процент риска',
        variant: 'destructive',
      });
      return;
    }

    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      pair: signal.pair,
      direction: signal.direction,
      openTime: new Date().toLocaleTimeString('ru-RU'),
      expiration: signal.expiration,
      amount: positionSize,
      profit: 0,
      status: 'open',
      market: signal.market,
    };

    setTrades(prev => [newTrade, ...prev]);
    setBalance(prev => prev - positionSize);

    toast({
      title: '🚀 Сделка открыта!',
      description: `${signal.pair} ${signal.direction} на $${positionSize} (${signal.market.toUpperCase()})`,
    });
  };

  const classicSignals = signals.filter(s => s.market === 'classic');
  const otcSignals = signals.filter(s => s.market === 'otc');
  const filteredSignals = selectedMarket === 'all' ? signals : 
                         selectedMarket === 'classic' ? classicSignals : otcSignals;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1800px] mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pocket Option Analyzer Pro</h1>
              <p className="text-sm text-muted-foreground">
                🔄 Real-time AI Analysis • 🎯 Smart Signals • 📊 Multi-Market
              </p>
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
              <div className={`text-3xl font-mono font-bold ${stats.todayProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {stats.todayProfit >= 0 ? '+' : ''}${stats.todayProfit.toFixed(2)}
              </div>
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
              <div className={`text-3xl font-mono font-bold ${stats.totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
              </div>
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
            <MarketSelector
              selectedMarket={selectedMarket}
              onMarketChange={setSelectedMarket}
              classicCount={classicSignals.length}
              otcCount={otcSignals.length}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProfitableSignals
                signals={filteredSignals}
                formatTime={formatTime}
                onOpenTrade={handleOpenTrade}
                balance={balance}
              />

              <div className="space-y-4">
                <ActiveTrades
                  trades={trades}
                  formatTime={formatTime}
                  currentTime={currentTime}
                />
                
                <MarketAnalysis marketData={marketData} />
              </div>
            </div>
          </TabsContent>

          <TradingTabs autoUpdate={autoUpdate} setAutoUpdate={setAutoUpdate} />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;