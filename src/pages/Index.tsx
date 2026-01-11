import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Signal {
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

interface MarketData {
  pair: string;
  trend: 'up' | 'down' | 'neutral';
  volume: number;
  volatility: number;
}

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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Активные сигналы</span>
                      <Badge variant="outline" className="font-mono">
                        {signals.filter(s => s.status === 'active').length} активных
                      </Badge>
                    </CardTitle>
                    <CardDescription>Обновление каждую секунду</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                        {signals.map((signal) => (
                          <Card
                            key={signal.id}
                            className={`border-2 transition-all ${
                              signal.status === 'active'
                                ? signal.direction === 'CALL'
                                  ? 'border-primary/50 animate-pulse-glow'
                                  : 'border-destructive/50 animate-pulse-glow-red'
                                : 'border-muted'
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                      signal.direction === 'CALL'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-destructive/20 text-destructive'
                                    }`}
                                  >
                                    <Icon
                                      name={signal.direction === 'CALL' ? 'TrendingUp' : 'TrendingDown'}
                                      size={24}
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-mono font-bold text-lg">{signal.pair}</h3>
                                    <p className="text-xs text-muted-foreground">{signal.strategy}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant={signal.market === 'classic' ? 'default' : 'secondary'}>
                                    {signal.market === 'classic' ? 'Классик' : 'OTC'}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Экспирация: {signal.expiration}
                                  </p>
                                </div>
                              </div>

                              <Separator className="my-3" />

                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Вероятность</p>
                                  <div className="flex items-center gap-2">
                                    <Progress value={signal.probability} className="flex-1" />
                                    <span className="font-mono font-bold text-sm">{signal.probability}%</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">До открытия</p>
                                  <p className="font-mono font-bold text-lg">
                                    {formatTime(signal.timeToOpen)}
                                  </p>
                                </div>
                              </div>

                              <Button
                                className="w-full"
                                variant={signal.direction === 'CALL' ? 'default' : 'destructive'}
                                disabled={signal.status !== 'active' || signal.timeToOpen > 60}
                              >
                                {signal.timeToOpen > 60
                                  ? `Ожидание ${formatTime(signal.timeToOpen - 60)}`
                                  : signal.direction === 'CALL'
                                  ? 'Открыть CALL'
                                  : 'Открыть PUT'}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Управление рисками</CardTitle>
                    <CardDescription>Автоматический расчёт позиции</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Процент риска на сделку</Label>
                        <span className="font-mono font-bold">{riskPercent}%</span>
                      </div>
                      <Input
                        type="range"
                        min="1"
                        max="10"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground">
                        Рекомендуем не более 2-3% от баланса
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Баланс счёта</Label>
                        <span className="font-mono font-bold text-lg">${balance}</span>
                      </div>
                      <Input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(Number(e.target.value))}
                        className="font-mono"
                      />
                    </div>

                    <Separator />

                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Размер позиции</p>
                      <p className="text-3xl font-mono font-bold text-primary">
                        ${calculatePositionSize()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {riskPercent}% от {balance} USD
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">При убытке</p>
                        <p className="font-mono font-bold text-destructive">
                          -${calculatePositionSize()}
                        </p>
                      </div>
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">При прибыли (80%)</p>
                        <p className="font-mono font-bold text-primary">
                          +${(Number(calculatePositionSize()) * 0.8).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Анализ рынков</CardTitle>
                    <CardDescription>Текущее состояние валютных пар</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {marketData.map((market) => (
                        <div
                          key={market.pair}
                          className="flex items-center justify-between p-3 bg-card border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                market.trend === 'up'
                                  ? 'bg-primary/20 text-primary'
                                  : market.trend === 'down'
                                  ? 'bg-destructive/20 text-destructive'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Icon
                                name={
                                  market.trend === 'up'
                                    ? 'TrendingUp'
                                    : market.trend === 'down'
                                    ? 'TrendingDown'
                                    : 'Minus'
                                }
                                size={20}
                              />
                            </div>
                            <div>
                              <p className="font-mono font-bold">{market.pair}</p>
                              <p className="text-xs text-muted-foreground">
                                Vol: {(market.volume / 1000000).toFixed(2)}M
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={market.trend === 'up' ? 'default' : 'destructive'}>
                              {market.trend === 'up' ? 'Рост' : market.trend === 'down' ? 'Падение' : 'Боковик'}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Волатильность: {market.volatility}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Технический анализ</CardTitle>
                <CardDescription>Графики и индикаторы в реальном времени</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center space-y-3">
                    <Icon name="LineChart" size={64} className="text-muted-foreground mx-auto" />
                    <p className="text-xl font-semibold">Интерактивные графики</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Здесь будут отображаться графики TradingView с техническими индикаторами,
                      свечными паттернами и уровнями поддержки/сопротивления
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'RSI + MACD', winRate: 78, trades: 156, icon: 'Activity' },
                { name: 'Bollinger Bands', winRate: 72, trades: 203, icon: 'TrendingUp' },
                { name: 'EMA Crossover', winRate: 85, trades: 98, icon: 'Zap' },
                { name: 'Support/Resistance', winRate: 68, trades: 234, icon: 'BarChart3' },
                { name: 'Price Action', winRate: 81, trades: 127, icon: 'Target' },
                { name: 'Volume Analysis', winRate: 74, trades: 165, icon: 'BarChart4' },
              ].map((strategy, idx) => (
                <Card key={idx} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Icon name={strategy.icon as any} size={24} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{strategy.name}</CardTitle>
                        <CardDescription className="text-xs">{strategy.trades} сделок</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Win Rate</span>
                        <span className="font-mono font-bold text-primary">{strategy.winRate}%</span>
                      </div>
                      <Progress value={strategy.winRate} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Портфель и позиции</CardTitle>
                <CardDescription>Управление активными сделками</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center space-y-3">
                    <Icon name="Briefcase" size={64} className="text-muted-foreground mx-auto" />
                    <p className="text-xl font-semibold">Активные позиции</p>
                    <p className="text-sm text-muted-foreground">
                      Здесь будут отображаться все открытые сделки с P&L в реальном времени
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Статистика по дням</CardTitle>
                  <CardDescription>Последние 7 дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                    <div className="text-center">
                      <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">График прибыли</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Распределение по валютным парам</CardTitle>
                  <CardDescription>Топ активов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { pair: 'EUR/USD', trades: 45, profit: 234.5 },
                      { pair: 'GBP/USD', trades: 38, profit: 189.2 },
                      { pair: 'BTC/USD', trades: 29, profit: 312.8 },
                      { pair: 'USD/JPY', trades: 24, profit: 156.3 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                        <div>
                          <p className="font-mono font-bold">{item.pair}</p>
                          <p className="text-xs text-muted-foreground">{item.trades} сделок</p>
                        </div>
                        <p className="font-mono font-bold text-primary">+${item.profit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Технические индикаторы</CardTitle>
                <CardDescription>Настройка параметров анализа</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'RSI', value: 67, status: 'neutral' },
                    { name: 'MACD', value: 0.85, status: 'bullish' },
                    { name: 'Stochastic', value: 42, status: 'bearish' },
                    { name: 'ATR', value: 1.23, status: 'neutral' },
                    { name: 'ADX', value: 28, status: 'bullish' },
                    { name: 'CCI', value: -45, status: 'bearish' },
                  ].map((indicator, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{indicator.name}</p>
                          <Badge
                            variant={
                              indicator.status === 'bullish'
                                ? 'default'
                                : indicator.status === 'bearish'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {indicator.status}
                          </Badge>
                        </div>
                        <p className="text-2xl font-mono font-bold">{indicator.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки анализатора</CardTitle>
                <CardDescription>Персонализация работы бота</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Автообновление данных</Label>
                    <p className="text-xs text-muted-foreground">
                      Обновление сигналов каждую секунду
                    </p>
                  </div>
                  <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>ID профиля Pocket Option</Label>
                  <Input placeholder="Введите ваш ID для синхронизации" className="font-mono" />
                  <p className="text-xs text-muted-foreground">
                    Для автоматической синхронизации с вашим аккаунтом
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Минимальная вероятность сигнала</Label>
                  <div className="flex items-center gap-4">
                    <Input type="range" min="60" max="95" defaultValue="75" className="flex-1" />
                    <span className="font-mono font-bold w-12">75%</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Уведомления</Label>
                  <div className="space-y-2">
                    {[
                      'Новые сигналы',
                      'Закрытие позиций',
                      'Достижение целей',
                      'Предупреждения о рисках',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <span className="text-sm">{item}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>История сделок</CardTitle>
                <CardDescription>Архив всех закрытых позиций</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { pair: 'EUR/USD', direction: 'CALL', profit: 16.8, time: '14:32', result: 'win' },
                    { pair: 'GBP/USD', direction: 'PUT', profit: -20.0, time: '14:28', result: 'loss' },
                    { pair: 'BTC/USD', direction: 'CALL', profit: 32.5, time: '14:15', result: 'win' },
                    { pair: 'USD/JPY', direction: 'PUT', profit: 18.2, time: '14:08', result: 'win' },
                    { pair: 'EUR/USD', direction: 'CALL', profit: -20.0, time: '13:55', result: 'loss' },
                  ].map((trade, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            trade.result === 'win'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-destructive/20 text-destructive'
                          }`}
                        >
                          <Icon name={trade.direction === 'CALL' ? 'TrendingUp' : 'TrendingDown'} size={20} />
                        </div>
                        <div>
                          <p className="font-mono font-bold">{trade.pair}</p>
                          <p className="text-xs text-muted-foreground">{trade.time} МСК</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-mono font-bold ${
                            trade.result === 'win' ? 'text-primary' : 'text-destructive'
                          }`}
                        >
                          {trade.result === 'win' ? '+' : ''}${trade.profit}
                        </p>
                        <Badge variant={trade.result === 'win' ? 'default' : 'destructive'} className="text-xs">
                          {trade.result === 'win' ? 'Прибыль' : 'Убыток'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
