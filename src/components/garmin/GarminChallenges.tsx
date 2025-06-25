
import { Target, Users, Camera, Trophy, Calendar } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";

const GarminChallenges = () => {
  const challenges = [
    {
      name: 'June Weekend 10K',
      period: '27–29 de jun.',
      type: '10K',
      icon: Target,
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      name: 'June Photo Share',
      period: '1–30 de jun.',
      type: 'Photo',
      icon: Camera,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'June Love Challenge',
      period: '1–30 de jun.',
      type: 'Love',
      icon: Trophy,
      gradient: 'from-red-500 to-orange-500'
    }
  ];

  const expeditions = [
    {
      name: 'Aconcágua',
      altitude: '6961m',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Circuito Annapurna',
      altitude: '5200m',
      gradient: 'from-green-600 to-blue-600'
    },
    {
      name: 'Trilha dos Apalaches',
      distance: '3500k',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      name: 'Caminhos de Santiago',
      distance: '784k',
      gradient: 'from-yellow-600 to-orange-600'
    }
  ];

  const myGoals = [
    {
      name: 'Tabela de classificação semanal',
      participants: '1 contato',
      icon: Users
    }
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="garmin-card">
        <h1 className="text-2xl font-bold text-primary mb-2">Desafios</h1>
        <p className="text-secondary">Participe de desafios e conquiste novas metas</p>
      </div>

      {/* Participate in Challenge */}
      <div className="garmin-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Participar de um desafio</h3>
          <button className="text-blue-500 text-sm font-medium">Ver tudo</button>
        </div>
        
        <div className="grid gap-4">
          {challenges.map((challenge, index) => (
            <div key={index} className={`p-4 rounded-xl bg-gradient-to-r ${challenge.gradient} text-white relative overflow-hidden`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <challenge.icon className="w-5 h-5" />
                    <span className="font-bold text-lg">{challenge.type}</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{challenge.name}</h4>
                  <p className="text-sm opacity-90">{challenge.period}</p>
                </div>
                <div className="absolute top-2 right-2 text-6xl opacity-10">
                  <challenge.icon />
                </div>
              </div>
              
              <div className="mt-4">
                <ModernButton 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Participar
                </ModernButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start an Expedition */}
      <div className="garmin-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Iniciar uma expedição</h3>
          <button className="text-blue-500 text-sm font-medium">Ver tudo</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {expeditions.map((expedition, index) => (
            <div key={index} className={`p-4 rounded-xl bg-gradient-to-br ${expedition.gradient} text-white relative min-h-[120px] flex flex-col justify-between`}>
              <div>
                <h4 className="font-semibold text-sm mb-1">{expedition.name}</h4>
                <div className="text-2xl font-bold">
                  {expedition.altitude || expedition.distance}
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-20">
                <Target className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Goals */}
      <div className="garmin-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">Meus desafios</h3>
          <button className="text-blue-500 text-sm font-medium">Ver tudo</button>
        </div>
        
        <div className="space-y-3">
          {myGoals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-700">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-primary">{goal.name}</div>
                <div className="text-sm text-secondary">{goal.participants}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Challenge Button */}
      <div className="garmin-card text-center">
        <ModernButton variant="primary" className="w-full">
          <Target className="w-5 h-5" />
          Criar desafio
        </ModernButton>
      </div>
    </div>
  );
};

export default GarminChallenges;
