
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Pause, Play } from "lucide-react";
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
  
  const getPhaseColor = (phase: string) => {
    if (phase.includes('Digestão')) return 'bg-blue-500';
    if (phase.includes('Glicogênio')) return 'bg-yellow-500';
    if (phase.includes('Cetose')) return 'bg-orange-500';
    if (phase.includes('Autofagia')) return 'bg-purple-500';
    return 'bg-green-500';
  };

  return (
    <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 shadow-lg mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="w-6 h-6 text-blue-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Jejum {currentFast.type}</span>
                {isPaused && <Badge variant="secondary" className="text-xs">PAUSADO</Badge>}
              </div>
              <Badge className={`${getPhaseColor(getFastingPhase())} text-white text-xs`}>
                {getFastingPhase()} • {progress.toFixed(1)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                restante
              </div>
            </div>
            
            <button
              onClick={onPause}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
            >
              {isActive && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactFastingTimer;
