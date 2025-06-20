
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: string;
  completed: boolean;
}

interface FastingTimerProps {
  currentFast: FastingSession | null;
  timeRemaining: number;
  isActive: boolean;
  onPause: () => void;
  onStop: () => void;
  formatTime: (seconds: number) => string;
  calculateProgress: () => number;
  getMotivationalMessage: () => string;
  fastingPlans: any;
}

const FastingTimer = ({
  currentFast,
  timeRemaining,
  isActive,
  onPause,
  onStop,
  formatTime,
  calculateProgress,
  getMotivationalMessage,
  fastingPlans
}: FastingTimerProps) => {
  if (!currentFast) return null;

  return (
    <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Timer className="w-8 h-8" />
          Jejum {currentFast.type}
        </CardTitle>
        <CardDescription className="text-lg">
          {isActive ? getMotivationalMessage() : 'Jejum pausado - Continue quando estiver pronto'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">
            {formatTime(timeRemaining)}
          </div>
          <Progress value={calculateProgress()} className="h-4 mb-4" />
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{calculateProgress().toFixed(1)}% concluído</span>
            <span>{formatTime(currentFast.duration - timeRemaining)} / {formatTime(currentFast.duration)}</span>
          </div>
          <p className="text-sm text-gray-600">
            {fastingPlans[currentFast.type as keyof typeof fastingPlans]?.calories}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onPause}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? 'Pausar' : 'Continuar'}
          </Button>
          <Button
            onClick={onStop}
            variant="destructive"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Parar Jejum
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FastingTimer;
