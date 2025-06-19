
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Gift } from 'lucide-react';

interface TestActionsProps {
  onAddPoints: () => void;
  onUnlockShield: () => void;
  onCollectSticker: () => void;
  dailyPointsClaimed: boolean;
}

const TestActions = ({ 
  onAddPoints, 
  onUnlockShield, 
  onCollectSticker, 
  dailyPointsClaimed 
}: TestActionsProps) => {
  return (
    <Card className="border-2 border-dashed border-red-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-red-600" />
          Laboratório de Conquistas
        </CardTitle>
        <CardDescription>
          Experimente desbloquear conquistas para testar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          onClick={onAddPoints} 
          className="w-full"
          disabled={dailyPointsClaimed}
        >
          <Gift className="w-4 h-4 mr-2" />
          {dailyPointsClaimed ? "Pontos já coletados hoje" : "Ganhar 10 pontos"}
        </Button>
        <Button onClick={onUnlockShield} variant="outline" className="w-full">
          Desbloquear Escudo "Primeira Pesagem"
        </Button>
        <Button onClick={onCollectSticker} variant="outline" className="w-full">
          Coletar Figurinha "Motivado"
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestActions;
