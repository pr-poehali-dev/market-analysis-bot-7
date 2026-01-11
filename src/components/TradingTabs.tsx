import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface TradingTabsProps {
  autoUpdate: boolean;
  setAutoUpdate: (value: boolean) => void;
}

const TradingTabs = ({ autoUpdate, setAutoUpdate }: TradingTabsProps) => {
  return (
    <>
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
    </>
  );
};

export default TradingTabs;
