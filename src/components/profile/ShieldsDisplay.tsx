
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Trophy } from 'lucide-react';
import { getShieldInfo } from './ShieldInfo';
import { Database } from '@/integrations/supabase/types';

type UserStats = Database['public']['Tables']['user_stats']['Row'];

interface ShieldsDisplayProps {
  userStats: UserStats | null;
}

const ShieldsDisplay = ({ userStats }: ShieldsDisplayProps) => {
  if (!userStats || !userStats.shields || userStats.shields.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Shield className="w-6 h-6" />
          Escudos Conquistados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {userStats.shields.map((shieldId, index) => {
            const shield = getShieldInfo(shieldId);
            return (
              <Badge 
                key={index}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2"
              >
                <span className="text-lg">{shield.emoji}</span>
                <div className="flex flex-col">
                  <span>{shield.name}</span>
                  <span className="text-xs opacity-90">{shield.description}</span>
                </div>
              </Badge>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-yellow-700">
          <Trophy className="w-4 h-4" />
          <span>Continue registrando seu peso diariamente para conquistar mais escudos!</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShieldsDisplay;
