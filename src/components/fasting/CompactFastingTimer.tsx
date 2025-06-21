
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Pause, Play, Flame, Zap } from "lucide-react";
import { FastingSession } from "@/hooks/useFasting";

interface CompactFastingTimerProps {
  currentFast: FastingSession | null;
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  onPause: () => void;
  formatTime: (seconds: number) => string;
  calculateProgress: () => number;
  getFastingPhase: () => string;
}

const CompactFastingTimer = ({
  currentFast,
  timeRemaining,
  isActive,
  isPaused,
  onPause,
  formatTime,
  calculateProgress,
  getFastingPhase
}: CompactFastingTimerProps) => {
  if (!currentFast) return null;

  const progress = calculateProgress();
  const phase = getFastingPhase();
  
  const getPhaseColor = (phase: string) => {
    if (phase.includes('Digestão')) return 'from-blue-500 to-blue-600';
    if (phase.includes('Glicogênio')) return 'from-yellow-500 to-orange-500';
    if (phase.includes('Cetose')) return 'from-orange-500 to-red-500';
    if (phase.includes('Autofagia')) return 'from-purple-500 to-pink-500';
    return 'from-green-500 to-emerald-500';
  };

  const getPhaseIcon = (phase: string) => {
    if (phase.includes('Cetose') || phase.includes('Autofagia')) {
      return <Flame className="w-3 h-3" />;
    }
    return <Zap className="w-3 h-3" />;
  };

  const getBadgeStyle = (phase: string) => {
    if (phase.includes('Digestão')) return 'bg-blue-500 hover:bg-blue-600';
    if (phase.includes('Glicogênio')) return 'bg-yellow-500 hover:bg-yellow-600';
    if (phase.includes('Cetose')) return 'bg-orange-500 hover:bg-orange-600';
    if (phase.includes('Autofagia')) return 'bg-purple-500 hover:bg-purple-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 shadow-md backdrop-blur-sm mb-4 overflow-hidden">
      <CardContent className="p-4">
        {/* Header compacto */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {isActive && !isPaused && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                  Você está em Jejum {currentFast.type}
                </span>
                {isPaused && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    PAUSADO
                  </Badge>
                )}
              </div>
              <Badge className={`${getBadgeStyle(phase)} text-white text-xs px-2 py-0.5 transition-all duration-200 hover:scale-105`}>
                <span className="flex items-center gap-1">
                  {getPhaseIcon(phase)}
                  {phase} • {progress.toFixed(0)}%
                </span>
              </Badge>
            </div>
          </div>
          
          {/* Botão de pausa/play compacto */}
          <button 
            onClick={onPause} 
            className="group relative p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg active:scale-95"
          >
            {isActive && !isPaused ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>

        {/* Timer e barra de progresso em linha */}
        <div className="flex items-center gap-4">
          {/* Timer principal compacto */}
          <div className="text-2xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {formatTime(timeRemaining)}
          </div>
          
          {/* Barra de progresso */}
          <div className="flex-1">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getPhaseColor(phase)} rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {progress.toFixed(0)}% completo
            </div>
          </div>
        </div>

        {/* Motivação minimalista para progresso alto */}
        {progress >= 75 && (
          <div className="mt-3 text-center animate-fade-in">
            <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3" />
              Quase lá! Você está arrasando! 🔥
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactFastingTimer;
