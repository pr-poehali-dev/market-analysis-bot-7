import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Signal } from '@/types/trading';

interface SignalsPanelProps {
  signals: Signal[];
  formatTime: (seconds: number) => string;
  onOpenTrade: (signal: Signal) => void;
}

const SignalsPanel = ({ signals, formatTime, onOpenTrade }: SignalsPanelProps) => {
  return (
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

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="col-span-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Технические индикаторы</span>
                        <Badge variant={signal.confidence === 'high' ? 'default' : signal.confidence === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                          {signal.confidence === 'high' ? '🔥 Высокая' : signal.confidence === 'medium' ? '⚡ Средняя' : '⚠️ Низкая'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 p-2 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">RSI</p>
                          <p className="text-xs font-mono font-bold">{signal.indicators.rsi}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">MACD</p>
                          <p className="text-xs font-mono font-bold">{signal.indicators.macd}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">EMA</p>
                          <p className="text-xs font-mono font-bold">{signal.indicators.ema}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">BB</p>
                          <p className="text-xs font-mono font-bold">{signal.indicators.bollinger}</p>
                        </div>
                      </div>
                    </div>
                  </div>

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
                    onClick={() => onOpenTrade(signal)}
                  >
                    {signal.timeToOpen > 60
                      ? `Ожидание ${formatTime(signal.timeToOpen - 60)}`
                      : signal.direction === 'CALL'
                      ? '📈 Открыть CALL'
                      : '📉 Открыть PUT'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SignalsPanel;