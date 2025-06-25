
import { Activity, Trophy, Timer, Zap, Heart, TrendingUp } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";

const GarminHomeScreen = () => {
  const todayStats = {
    steps: 8547,
    calories: 2330,
    activeMinutes: 42,
    distance: 6.2
  };

  const recentActivities = [
    {
      type: 'Corrida',
      date: '28 de março',
      distance: '5,57 km',
      time: '1:48:43',
      pace: '19:32 /km',
      color: 'orange'
    },
    {
      type: 'Caminhada', 
      date: '27 de março',
      distance: '3,2 km',
      time: '45:30',
      pace: '14:15 /km',
      color: 'green'
    }
  ];

  const challenges = [
    { name: 'June Weekend 10K', period: '27-29 de jun.', type: '10K' },
    { name: 'June Photo Share', period: '1-30 de jun.', type: 'Photo' },
    { name: 'June Love', period: '1-30 de jun.', type: 'Love' }
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Welcome Banner */}
      <div className="garmin-card-large">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Olá, Paulo!</h2>
            <p className="text-secondary">Vamos conquistar mais um dia</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <ModernButton variant="primary" className="flex-1">
            <Activity className="w-4 h-4" />
            Iniciar Atividade
          </ModernButton>
          <ModernButton variant="secondary" className="flex-1">
            <Timer className="w-4 h-4" />
            Jejum
          </ModernButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="garmin-card">
        <h3 className="text-lg font-semibold text-primary mb-4">Hoje</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="stat-value">{todayStats.steps.toLocaleString()}</div>
            <div className="stat-label">Passos</div>
          </div>
          <div className="text-center">
            <div className="stat-value">{todayStats.calories.toLocaleString()}</div>
            <div className="stat-label">Calorias</div>
          </div>
          <div className="text-center">
            <div className="stat-value">{todayStats.activeMinutes}</div>
            <div className="stat-label">Min. Ativos</div>
          </div>
          <div className="text-center">
            <div className="stat-value">{todayStats.distance}</div>
            <div className="stat-label">km</div>
          </div>
        </div>
      </div>

      {/* Visualização Rápida */}
      <div className="garmin-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Visualização rápida</h3>
          <button className="text-blue-500 text-sm font-medium">Ver tudo</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="garmin-card text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-primary font-semibold">Freq. cardíaca</div>
            <div className="text-xs text-muted mt-1">Use seu dispositivo para monitorar</div>
          </div>
          
          <div className="garmin-card text-center">
            <Timer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-primary font-semibold">Min. de intensidade</div>
            <div className="stat-value text-2xl mt-2">{todayStats.activeMinutes}</div>
          </div>
          
          <div className="garmin-card text-center">
            <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-primary font-semibold">Calorias queimadas</div>
            <div className="stat-value text-2xl mt-2">{todayStats.calories}</div>
          </div>
          
          <div className="garmin-card text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-primary font-semibold">Estresse</div>
            <div className="text-xs text-muted mt-1">Use seu dispositivo para monitorar</div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="garmin-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Atividades Recentes</h3>
          <button className="text-blue-500 text-sm font-medium">Ver todas</button>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className={`activity-card ${activity.color}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="font-semibold">{activity.type}</span>
                  </div>
                  <div className="text-sm opacity-90">{activity.date}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{activity.distance}</div>
                  <div className="text-xs uppercase opacity-75">Distância</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activity.time}</div>
                  <div className="text-xs uppercase opacity-75">Tempo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activity.pace}</div>
                  <div className="text-xs uppercase opacity-75">Ritmo</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges Preview */}
      <div className="garmin-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Desafios</h3>
          <button className="text-blue-500 text-sm font-medium">Ver todos</button>
        </div>
        
        <div className="space-y-3">
          {challenges.slice(0, 2).map((challenge, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
              <div>
                <div className="font-semibold text-primary">{challenge.name}</div>
                <div className="text-sm text-secondary">{challenge.period}</div>
              </div>
              <ModernButton variant="secondary" size="sm">
                Participar
              </ModernButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GarminHomeScreen;
