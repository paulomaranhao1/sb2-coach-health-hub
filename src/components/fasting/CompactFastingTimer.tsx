
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
      return <Flame className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  const getBadgeStyle = (phase: string) => {
    if (phase.includes('Digestão')) return 'bg-blue-500 hover:bg-blue-600';
    if (phase.includes('Glicogênio')) return 'bg-yellow-500 hover:bg-yellow-600';
    if (phase.includes('Cetose')) return 'bg-orange-500 hover:bg-orange-600';
    if (phase.includes('Autofagia')) return 'bg-purple-500 hover:bg-purple-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  return (
    <Card className="border-2 border-gradient-to-r from-blue-400/50 to-purple-400/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/50 dark:to-purple-950/50 shadow-xl backdrop-blur-sm mb-6 overflow-hidden">
      <CardContent className="p-6">
        {/* Header com título e status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Timer className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              {isActive && !isPaused && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                  Jejum {currentFast.type}
                </span>
                {isPaused && (
                  <Badge variant="secondary" className="text-xs animate-pulse bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    PAUSADO
                  </Badge>
                )}
              </div>
              <Badge className={`${getBadgeStyle(phase)} text-white text-xs transition-all duration-200 hover:scale-105 shadow-md`}>
                <span className="flex items-center gap-1">
                  {getPhaseIcon(phase)}
                  {phase} • {progress.toFixed(1)}%
                </span>
              </Badge>
            </div>
          </div>
          
          {/* Botão de pausa/play melhorado */}
          <button 
            onClick={onPause} 
            className="group relative p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {isActive && !isPaused ? (
              <Pause className="w-5 h-5 relative z-10" />
            ) : (
              <Play className="w-5 h-5 relative z-10 ml-0.5" />
            )}
          </button>
        </div>

        {/* Timer principal */}
        <div className="text-center mb-4">
          <div className="text-4xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-1">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            tempo restante
          </div>
        </div>
        
        {/* Barra de progresso melhorada */}
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className={`h-full bg-gradient-to-r ${getPhaseColor(phase)} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              {/* Efeito de brilho na barra */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          
          {/* Marcadores de progresso */}
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {progress.toFixed(0)}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Motivação baseada no progresso */}
        {progress >= 75 && (
          <div className="mt-4 text-center animate-fade-in">
            <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />
              Quase lá! Você está arrasando! 🔥
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactFastingTimer;
