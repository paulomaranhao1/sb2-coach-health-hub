
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Scale, Camera, Clock } from "lucide-react";

interface RecentActivityProps {
  weightEntries: any[];
  lastFastingSession?: any;
  recentFoodAnalysis?: any;
  onAddWeight: () => void;
  onViewProgress: () => void;
}

const RecentActivity = ({ 
  weightEntries, 
  lastFastingSession, 
  recentFoodAnalysis,
  onAddWeight,
  onViewProgress 
}: RecentActivityProps) => {
  const hasAnyActivity = weightEntries.length > 0 || lastFastingSession || recentFoodAnalysis;

  if (!hasAnyActivity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nenhuma atividade ainda</p>
            <p className="text-sm text-gray-400 mb-6">
              Comece registrando seu peso para ver seu progresso aqui!
            </p>
            <Button onClick={onAddWeight} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Registrar primeiro peso
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activities = [];

  // Add weight entries
  if (weightEntries.length > 0) {
    weightEntries.slice(0, 3).forEach((entry: any, index: number) => {
      activities.push({
        type: 'weight',
        icon: <Scale className="w-4 h-4 text-blue-500" />,
        title: `Peso registrado: ${entry.weight}kg`,
        subtitle: new Date(entry.date).toLocaleDateString('pt-BR'),
        time: new Date(entry.date),
        badge: index === 0 ? 'Mais recente' : undefined
      });
    });
  }

  // Add fasting session
  if (lastFastingSession) {
    activities.push({
      type: 'fasting',
      icon: <Clock className="w-4 h-4 text-purple-500" />,
      title: lastFastingSession.completed ? 'Jejum completado' : 'Jejum em andamento',
      subtitle: `${Math.floor(lastFastingSession.duration / 3600)}h de jejum`,
      time: new Date(lastFastingSession.start_time),
      badge: lastFastingSession.completed ? 'Concluído' : 'Ativo'
    });
  }

  // Add food analysis
  if (recentFoodAnalysis) {
    activities.push({
      type: 'food',
      icon: <Camera className="w-4 h-4 text-green-500" />,
      title: `Análise: ${recentFoodAnalysis.total_calories} calorias`,
      subtitle: new Date(recentFoodAnalysis.analyzed_at).toLocaleDateString('pt-BR'),
      time: new Date(recentFoodAnalysis.analyzed_at),
      badge: 'Analisado'
    });
  }

  // Sort by time (most recent first)
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                {activity.icon}
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.subtitle}</p>
                </div>
              </div>
              {activity.badge && (
                <Badge variant="outline" className="text-xs">
                  {activity.badge}
                </Badge>
              )}
            </div>
          ))}
          
          {activities.length > 5 && (
            <Button 
              variant="ghost" 
              onClick={onViewProgress}
              className="w-full mt-4"
            >
              Ver todas as atividades
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
