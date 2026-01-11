import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { MarketData } from '@/types/trading';

interface MarketAnalysisProps {
  marketData: MarketData[];
}

const MarketAnalysis = ({ marketData }: MarketAnalysisProps) => {
  const strongMarkets = marketData.filter(m => m.strength >= 70).sort((a, b) => b.strength - a.strength);
  
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="LineChart" size={20} />
          Анализ рынков в реальном времени
        </CardTitle>
        <CardDescription>
          📊 Обновление каждые 3 секунды • Показываем только сильные тренды
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {strongMarkets.map((market) => (
              <Card
                key={market.pair}
                className="border-2 transition-all hover:border-primary/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          market.trend === 'up'
                            ? 'bg-gradient-to-br from-primary to-primary/60'
                            : market.trend === 'down'
                            ? 'bg-gradient-to-br from-destructive to-destructive/60'
                            : 'bg-muted'
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
                          size={24}
                          className={market.trend !== 'neutral' ? 'text-white' : 'text-muted-foreground'}
                        />
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-lg">{market.pair}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={market.trend === 'up' ? 'default' : market.trend === 'down' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {market.trend === 'up' ? '📈 Рост' : market.trend === 'down' ? '📉 Падение' : '➡️ Боковик'}
                          </Badge>
                          {market.strength >= 85 && (
                            <Badge variant="outline" className="text-xs">
                              🔥 Сильный тренд
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold">{market.strength}%</div>
                      <p className="text-xs text-muted-foreground">Сила тренда</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Сила тренда</span>
                        <span className="text-xs font-mono font-bold">{market.strength}%</span>
                      </div>
                      <Progress value={market.strength} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Объём</p>
                        <p className="text-sm font-mono font-bold">
                          {(market.volume / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Волатильность</p>
                        <p className="text-sm font-mono font-bold">{market.volatility}%</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Моментум</p>
                        <p className={`text-sm font-mono font-bold ${market.momentum >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {market.momentum >= 0 ? '+' : ''}{market.momentum}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">S/R</p>
                        <p className="text-xs font-mono">
                          {market.support} / {market.resistance}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MarketAnalysis;
