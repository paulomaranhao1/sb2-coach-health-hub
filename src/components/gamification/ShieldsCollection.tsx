
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Shield {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface ShieldsCollectionProps {
  shields: Shield[];
  userShields: string[];
}

const ShieldsCollection = ({ shields, userShields }: ShieldsCollectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🛡️ Coleção de Escudos
        </CardTitle>
        <CardDescription>
          Desbloqueie escudos completando desafios especiais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {shields.map((shield) => {
            const isUnlocked = userShields.includes(shield.id);
            return (
              <div 
                key={shield.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2 text-center">{shield.emoji}</div>
                <h3 className="font-semibold text-center mb-1">{shield.name}</h3>
                <p className="text-xs text-gray-600 text-center">{shield.description}</p>
                {isUnlocked && (
                  <Badge className="w-full mt-2 bg-green-600 text-white justify-center">
                    Desbloqueado
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShieldsCollection;
