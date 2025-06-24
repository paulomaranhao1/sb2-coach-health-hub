
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, RotateCcw, Flame, Zap } from "lucide-react";
import { FastingSession } from "@/hooks/useFasting";

interface CompactFastingTimerProps {
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

const CompactFastingTimer = ({
  currentFast,
  timeRemaining,
  isActive,
  isPaused,
  onPause,
  onStop,
  formatTime,
  calculateProgress,
  getFastingPhase
}: CompactFastingTimerProps) => {
  if (!currentFast) return null;

  const progress = calculateProgress();
  const phase = getFastingPhase();
  
  const getPhaseColor = (phase: string) => {
    if (phase.includes('Digestão')) return 'from-blue-500 to-blue-600';
    if (phase.includes('Glicogênio')) return 'from-orange-400 to-orange-500';
    if (phase.includes('Cetose')) return 'from-red-500 to-red-600';
    if (phase.includes('Autofagia')) return 'from-purple-500 to-purple-600';
    return 'from-emerald-500 to-emerald-600';
  };

  const getPhaseIcon = (phase: string) => {
    if (phase.includes('Cetose') || phase.includes('Autofagia')) {
      return <Flame className="w-3 h-3" />;
    }
    return <Zap className="w-3 h-3" />;
  };

  const getBadgeStyle = (phase: string) => {
    if (phase.includes('Digestão')) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
    if (phase.includes('Glicogênio')) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0';
    if (phase.includes('Cetose')) return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
    if (phase.includes('Autofagia')) return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0';
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0';
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-800/95 dark:to-slate-900/95 shadow-lg backdrop-blur-md mb-4 overflow-hidden">
      <CardContent className="p-4">
        {/* Header compacto */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                <Timer className="w-5 h-5 text-primary" />
                {isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                  Você está em Jejum {currentFast.type}
                </span>
              </div>
              <Badge className={`${getBadgeStyle(phase)} text-xs px-2.5 py-1 transition-all duration-200 hover:scale-105 shadow-sm`}>
                <span className="flex items-center gap-1.5">
                  {getPhaseIcon(phase)}
                  <span className="font-medium">{phase}</span>
                  <span className="text-white/80">•</span>
                  <span className="font-semibold">{progress.toFixed(0)}%</span>
                </span>
              </Badge>
            </div>
          </div>
          
          {/* Botão de parar elegante */}
          <button 
            onClick={onStop} 
            className="group relative p-3 rounded-full bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 hover:from-red-200 hover:to-red-300 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg active:scale-95 border border-red-200/50 dark:border-red-600/50"
          >
            <RotateCcw className="w-4 h-4 text-red-600 dark:text-red-400 transition-colors" />
          </button>
        </div>

        {/* Timer e barra de progresso */}
        <div className="flex items-center gap-4">
          {/* Timer principal */}
          <div className="text-2xl font-mono font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            {formatTime(timeRemaining)}
          </div>
          
          {/* Barra de progresso moderna */}
          <div className="flex-1">
            <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className={`h-full bg-gradient-to-r ${getPhaseColor(phase)} rounded-full transition-all duration-1000 ease-out relative shadow-sm`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-right font-medium">
              {progress.toFixed(0)}% completo
            </div>
          </div>
        </div>

        {/* Motivação elegante para progresso alto */}
        {progress >= 75 && (
          <div className="mt-3 text-center animate-fade-in">
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-full px-3 py-1.5">
              <Flame className="w-3 h-3 animate-pulse" />
              <span>Quase lá! Você está arrasando! 🔥</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactFastingTimer;
