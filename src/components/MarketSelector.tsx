import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface MarketSelectorProps {
  selectedMarket: 'classic' | 'otc' | 'all';
  onMarketChange: (market: 'classic' | 'otc' | 'all') => void;
  classicCount: number;
  otcCount: number;
}

const MarketSelector = ({ selectedMarket, onMarketChange, classicCount, otcCount }: MarketSelectorProps) => {
  return (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={20} className="text-muted-foreground" />
            <span className="font-semibold">Выбор рынка:</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedMarket === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMarketChange('all')}
              className="gap-2"
            >
              <Icon name="Globe" size={16} />
              Все рынки
              <Badge variant="secondary" className="ml-1">
                {classicCount + otcCount}
              </Badge>
            </Button>
            
            <Button
              variant={selectedMarket === 'classic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMarketChange('classic')}
              className="gap-2"
            >
              <Icon name="TrendingUp" size={16} />
              Классик
              <Badge variant="secondary" className="ml-1">
                {classicCount}
              </Badge>
            </Button>
            
            <Button
              variant={selectedMarket === 'otc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMarketChange('otc')}
              className="gap-2"
            >
              <Icon name="Clock" size={16} />
              OTC
              <Badge variant="secondary" className="ml-1">
                {otcCount}
              </Badge>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSelector;
