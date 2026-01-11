import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Trade } from '@/types/trading';

interface ActiveTradesProps {
  trades: Trade[];
  formatTime: (seconds: number) => string;
  currentTime: Date;
}

const ActiveTrades = ({ trades, currentTime }: ActiveTradesProps) => {
  const openTrades = trades.filter(t => t.status === 'open');
  
  const calculateTimeRemaining = (openTime: string, expiration: string) => {
    const openDate = new Date(openTime);
    const expirationMinutes = parseInt(expiration);
    const closeDate = new Date(openDate.getTime() + expirationMinutes * 60000);
    const remaining = Math.max(0, Math.floor((closeDate.getTime() - currentTime.getTime()) / 1000));
    return remaining;
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Активные сделки</span>
          <Badge variant="outline" className="font-mono">
            {openTrades.length} открытых
          </Badge>
        </CardTitle>
        <CardDescription>Обновление P&L в реальном времени</CardDescription>
      </CardHeader>
      <CardContent>
        {openTrades.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center space-y-3">
              <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Нет открытых сделок</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {openTrades.map((trade) => {
                const remaining = calculateTimeRemaining(trade.openTime, trade.expiration);
                const expirationMinutes = parseInt(trade.expiration);
                const progress = ((expirationMinutes * 60 - remaining) / (expirationMinutes * 60)) * 100;
                const currentProfit = Math.random() > 0.5 ? 
                  Math.random() * trade.amount * 0.8 : 
                  -trade.amount;

                return (
                  <Card
                    key={trade.id}
                    className="border-2 border-primary/30"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              trade.direction === 'CALL'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-destructive/20 text-destructive'
                            }`}
                          >
                            <Icon
                              name={trade.direction === 'CALL' ? 'TrendingUp' : 'TrendingDown'}
                              size={20}
                            />
                          </div>
                          <div>
                            <h3 className="font-mono font-bold">{trade.pair}</h3>
                            <p className="text-xs text-muted-foreground">{trade.openTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={trade.market === 'classic' ? 'default' : 'secondary'}>
                            {trade.market === 'classic' ? 'Классик' : 'OTC'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            ${trade.amount}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">До закрытия:</span>
                          <span className="font-mono font-bold">{formatTimeRemaining(remaining)}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">Текущий P&L:</span>
                          <span className={`font-mono font-bold ${currentProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)}
                          </span>
                        </div>
                      </div>
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

export default ActiveTrades;
