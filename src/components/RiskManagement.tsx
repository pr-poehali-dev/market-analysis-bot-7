import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { MarketData } from '@/types/trading';

interface RiskManagementProps {
  riskPercent: number;
  setRiskPercent: (value: number) => void;
  balance: number;
  setBalance: (value: number) => void;
  calculatePositionSize: () => string;
  marketData: MarketData[];
}

const RiskManagement = ({
  riskPercent,
  setRiskPercent,
  balance,
  setBalance,
  calculatePositionSize,
  marketData,
}: RiskManagementProps) => {
  return (
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
  );
};

export default RiskManagement;
