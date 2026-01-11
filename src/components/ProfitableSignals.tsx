import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Signal } from '@/types/trading';
import { getProfitPotential, getRecommendedAmount } from '@/utils/signalGenerator';

interface ProfitableSignalsProps {
  signals: Signal[];
  formatTime: (seconds: number) => string;
  onOpenTrade: (signal: Signal) => void;
  balance: number;
}

const ProfitableSignals = ({ signals, formatTime, onOpenTrade, balance }: ProfitableSignalsProps) => {
  const topSignals = signals.filter(s => s.probability >= 80).slice(0, 10);
  
  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} className="text-background" />
            </div>
            <span>🎯 Прибыльные сигналы</span>
          </div>
          <Badge variant="default" className="font-mono text-sm px-3 py-1">
            {topSignals.length} активных
          </Badge>
        </CardTitle>
        <CardDescription>
          ✨ AI анализирует все пары и показывает только прибыльные • Обновление каждую секунду
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topSignals.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center space-y-3">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto" />
              <p className="font-semibold">Поиск прибыльных возможностей...</p>
              <p className="text-sm text-muted-foreground">AI анализирует 30+ валютных пар</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[700px] pr-4">
            <div className="space-y-3">
              {topSignals.map((signal, index) => {
                const recommended = getRecommendedAmount(balance, signal.probability);
                const potential = getProfitPotential(signal);
                
                return (
                  <Card
                    key={signal.id}
                    className={`border-2 transition-all ${
                      signal.status === 'active'
                        ? signal.direction === 'CALL'
                          ? 'border-primary/60 bg-primary/5 animate-pulse-glow'
                          : 'border-destructive/60 bg-destructive/5 animate-pulse-glow-red'
                        : 'border-muted'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                signal.direction === 'CALL'
                                  ? 'bg-gradient-to-br from-primary to-primary/60'
                                  : 'bg-gradient-to-br from-destructive to-destructive/60'
                              }`}
                            >
                              <Icon
                                name={signal.direction === 'CALL' ? 'TrendingUp' : 'TrendingDown'}
                                size={28}
                                className="text-white"
                              />
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-mono font-bold text-xl">{signal.pair}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {signal.strategy}
                              </Badge>
                              <Badge variant={signal.market === 'classic' ? 'default' : 'secondary'} className="text-xs">
                                {signal.market === 'classic' ? 'Классик' : 'OTC'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">Уверенность:</span>
                            <Badge 
                              variant={signal.confidence === 'high' ? 'default' : signal.confidence === 'medium' ? 'secondary' : 'outline'}
                              className="text-xs font-bold"
                            >
                              {signal.confidence === 'high' ? '🔥 Высокая' : signal.confidence === 'medium' ? '⚡ Средняя' : '⚠️ Низкая'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Экспирация: <span className="font-mono font-bold">{signal.expiration}</span>
                          </p>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">Вероятность успеха</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-mono font-bold text-primary">{signal.probability}%</span>
                              {signal.probability >= 95 && <span className="text-xl">🚀</span>}
                              {signal.probability >= 90 && signal.probability < 95 && <span className="text-xl">⭐</span>}
                            </div>
                          </div>
                          <Progress value={signal.probability} className="h-3" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg border">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">RSI</p>
                            <p className="text-sm font-mono font-bold">{signal.indicators.rsi}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">MACD</p>
                            <p className="text-sm font-mono font-bold">{signal.indicators.macd}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">EMA</p>
                            <p className="text-sm font-mono font-bold">{signal.indicators.ema}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">BB</p>
                            <p className="text-sm font-mono font-bold">{signal.indicators.bollinger}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-card border rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">До открытия</p>
                            <p className="font-mono font-bold text-lg">{formatTime(signal.timeToOpen)}</p>
                          </div>
                          <div className="text-center p-2 bg-card border rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">Потенциал</p>
                            <p className="font-bold text-sm text-primary">{potential}</p>
                          </div>
                          <div className="text-center p-2 bg-card border rounded-lg">
                            <p className="text-[10px] text-muted-foreground mb-1">Сумма</p>
                            <p className="font-mono font-bold text-sm">${recommended.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full mt-3 h-12 text-base font-bold"
                        variant={signal.direction === 'CALL' ? 'default' : 'destructive'}
                        disabled={signal.status !== 'active' || signal.timeToOpen > 60}
                        onClick={() => onOpenTrade(signal)}
                      >
                        {signal.timeToOpen > 60 ? (
                          <>
                            <Icon name="Clock" size={18} className="mr-2" />
                            Ожидание {formatTime(signal.timeToOpen - 60)}
                          </>
                        ) : (
                          <>
                            {signal.direction === 'CALL' ? (
                              <>
                                <Icon name="TrendingUp" size={20} className="mr-2" />
                                Открыть CALL • ${recommended.toFixed(2)}
                              </>
                            ) : (
                              <>
                                <Icon name="TrendingDown" size={20} className="mr-2" />
                                Открыть PUT • ${recommended.toFixed(2)}
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitableSignals;
