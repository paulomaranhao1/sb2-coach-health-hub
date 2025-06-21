import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Play, Pause, RotateCcw, Droplets, Heart } from "lucide-react";
import { FastingSession } from "@/hooks/useFasting";
interface AdvancedFastingTimerProps {
  currentFast: FastingSession | null;
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  onPause: () => void;
  onStop: () => void;
  formatTime: (seconds: number) => string;
  calculateProgress: () => number;
  getFastingPhase: () => string;
}
const AdvancedFastingTimer = ({
  currentFast,
  timeRemaining,
  isActive,
  isPaused,
  onPause,
  onStop,
  formatTime,
  calculateProgress,
  getFastingPhase
}: AdvancedFastingTimerProps) => {
  if (!currentFast) return null;
  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - progress / 100 * circumference;
  const getPhaseColor = (phase: string) => {
    if (phase.includes('Digestão')) return 'bg-blue-500';
    if (phase.includes('Glicogênio')) return 'bg-yellow-500';
    if (phase.includes('Cetose')) return 'bg-orange-500';
    if (phase.includes('Autofagia')) return 'bg-purple-500';
    return 'bg-green-500';
  };
  const getMotivationalMessage = () => {
    if (progress < 10) return "🌱 Começando forte! Cada minuto importa!";
    if (progress < 25) return "💪 Corpo começando a se adaptar!";
    if (progress < 50) return "🔥 Entrando em cetose! Você está indo muito bem!";
    if (progress < 75) return "🧬 Autofagia ativada! Regeneração celular em curso!";
    if (progress < 90) return "💎 Cetose profunda! Você é incrível!";
    return "🏆 Últimos minutos! Você é um campeão!";
  };
  return <Card className="border-2 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-600">
          <Timer className="w-8 h-8 text-blue-600" />
          Jejum {currentFast.type}
          {isPaused && <Badge variant="secondary" className="ml-2">PAUSADO</Badge>}
        </CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge className={`${getPhaseColor(getFastingPhase())} text-white`}>
            {getFastingPhase()}
          </Badge>
          <Badge variant="outline">{progress.toFixed(1)}% concluído</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Circular Progress Timer */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
              {/* Progress circle */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer display in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-mono font-bold text-gray-800 dark:text-gray-200 mb-1">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {isActive && !isPaused ? getMotivationalMessage() : 'Jejum pausado'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor((currentFast.duration - timeRemaining) / 3600)}h
            </div>
            <div className="text-xs text-gray-600">Tempo Decorrido</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(timeRemaining / 3600)}h
            </div>
            <div className="text-xs text-gray-600">Tempo Restante</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-pink-600">
              {Math.floor(currentFast.duration / 3600)}h
            </div>
            <div className="text-xs text-gray-600">Duração Total</div>
          </div>
        </div>

        {/* Wellness Reminders */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Hidratação</span>
            </div>
            <span className="text-blue-600 font-medium">2-3L recomendados</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Como se sente?</span>
            </div>
            <span className="text-gray-600">Monitore seu bem-estar</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={onPause} variant="outline" size="lg" className="flex items-center gap-2 bg-white/80 hover:bg-white hover:scale-105 transition-all duration-200">
            {isActive && !isPaused ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive && !isPaused ? 'Pausar' : 'Continuar'}
          </Button>
          <Button onClick={onStop} variant="destructive" size="lg" className="flex items-center gap-2 hover:scale-105 transition-all duration-200">
            <RotateCcw className="w-5 h-5" />
            Parar Jejum
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default AdvancedFastingTimer;