
import { useState } from "react";
import { Plus, Droplets, Pill, Target, TrendingUp, Calendar, Award } from "lucide-react";
import { ModernCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Progress } from "@/components/ui/progress";

const ModernHomeScreen = () => {
  const [weight, setWeight] = useState(75.2);
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [todayPoints, setTodayPoints] = useState(150);

  const quickStats = [
    { label: "Peso Atual", value: `${weight}kg`, change: "-2.1kg", trend: "down", color: "text-green-600" },
    { label: "Meta Diária", value: "85%", change: "+15%", trend: "up", color: "text-blue-600" },
    { label: "Streak", value: "12 dias", change: "Novo recorde!", trend: "up", color: "text-purple-600" },
  ];

  const todayHabits = [
    { name: "Água", current: waterGlasses, target: 8, unit: "copos", icon: Droplets, color: "text-blue-500" },
    { name: "SB2 Turbo", current: 1, target: 2, unit: "doses", icon: Pill, color: "text-green-500" },
    { name: "Jejum", current: 14, target: 16, unit: "horas", icon: Target, color: "text-orange-500" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Saudação e Status */}
      <ModernCard variant="gradient" className="text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bom dia! 🌟</h2>
          <p className="text-slate-600">Você está indo muito bem na sua jornada!</p>
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-2xl font-bold text-blue-600">{todayPoints}</span>
            <span className="text-sm text-slate-600">pontos hoje</span>
          </div>
        </div>
      </ModernCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, index) => (
          <ModernCard key={index} padding="sm" className="text-center">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.color}`}>{stat.change}</p>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Entrada Rápida de Peso */}
      <ModernCard>
        <CardHeader icon={TrendingUp} iconColor="text-green-600">
          <div>
            <CardTitle>Peso de Hoje</CardTitle>
            <CardDescription>Registre seu peso atual</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <span className="text-3xl font-bold text-slate-900">{weight}</span>
                <span className="text-lg text-slate-600 ml-1">kg</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <ModernButton size="sm" onClick={() => setWeight(w => +(w + 0.1).toFixed(1))}>
                <Plus className="w-4 h-4" />
              </ModernButton>
              <ModernButton size="sm" variant="secondary" onClick={() => setWeight(w => +(w - 0.1).toFixed(1))}>
                <Plus className="w-4 h-4 rotate-45" />
              </ModernButton>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <ModernButton className="w-full" variant="success">
            Salvar Peso
          </ModernButton>
        </CardFooter>
      </ModernCard>

      {/* Hábitos de Hoje */}
      <ModernCard>
        <CardHeader icon={Calendar} iconColor="text-blue-600">
          <div>
            <CardTitle>Hábitos de Hoje</CardTitle>
            <CardDescription>Acompanhe seu progresso diário</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayHabits.map((habit, index) => {
              const progress = (habit.current / habit.target) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-slate-100 ${habit.color}`}>
                        <habit.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{habit.name}</p>
                        <p className="text-sm text-slate-600">
                          {habit.current}/{habit.target} {habit.unit}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-3 gap-2 w-full">
            <ModernButton size="sm" variant="ghost" onClick={() => setWaterGlasses(w => Math.min(w + 1, 8))}>
              +1 Água
            </ModernButton>
            <ModernButton size="sm" variant="ghost">
              SB2 Turbo
            </ModernButton>
            <ModernButton size="sm" variant="ghost">
              Ver Jejum
            </ModernButton>
          </div>
        </CardFooter>
      </ModernCard>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <ModernCard variant="outlined" className="text-center p-4 hover:bg-blue-50 cursor-pointer transition-colors">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-medium text-slate-900">Foto Caloria</p>
            <p className="text-xs text-slate-600">Analise sua refeição</p>
          </div>
        </ModernCard>
        
        <ModernCard variant="outlined" className="text-center p-4 hover:bg-purple-50 cursor-pointer transition-colors">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <p className="font-medium text-slate-900">Conquistas</p>
            <p className="text-xs text-slate-600">Veja seu progresso</p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default ModernHomeScreen;
