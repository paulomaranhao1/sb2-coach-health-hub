
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, Square, Coffee } from 'lucide-react';
import { useFasting } from '@/hooks/useFasting';
import { useLogger } from '@/utils/logger';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';

interface FastingTimerProps {
  onFastingStart?: () => void;
  onFastingEnd?: () => void;
}

const FastingTimer = memo(({ onFastingStart, onFastingEnd }: FastingTimerProps) => {
  const logger = useLogger('FastingTimer');
  const {
    currentFast,
    isActive,
    timeRemaining,
    isPaused,
    startFast,
    pauseFast,
    stopFast
  } = useFasting();

  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [isLoaded, setIsLoaded] = useState(true);

  // Memoized time formatting
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Update display time when timeRemaining changes
  useEffect(() => {
    if (timeRemaining > 0) {
      setDisplayTime(formatTime(timeRemaining));
    } else {
      setDisplayTime('00:00:00');
    }
  }, [timeRemaining, formatTime]);

  // Memoized progress calculation
  const progressData = useMemo(() => {
    if (!currentFast || !isActive) {
      return { percentage: 0, elapsed: 0, total: 0 };
    }

    const total = currentFast.duration;
    const elapsed = total - timeRemaining;
    const percentage = total > 0 ? (elapsed / total) * 100 : 0;

    return { percentage: Math.min(100, Math.max(0, percentage)), elapsed, total };
  }, [currentFast, isActive, timeRemaining]);

  // Memoized handlers
  const handleStart = useCallback((duration: number, type: string) => {
    logger.info('Starting fasting', { duration, type });
    startFast(type, duration);
    onFastingStart?.();
  }, [startFast, onFastingStart, logger]);

  const handlePause = useCallback(() => {
    logger.info('Pausing fasting');
    pauseFast();
  }, [pauseFast, logger]);

  const handleStop = useCallback(() => {
    logger.info('Stopping fasting');
    stopFast();
    onFastingEnd?.();
  }, [stopFast, onFastingEnd, logger]);

  // Memoized quick start options
  const quickStartOptions = useMemo(() => [
    { duration: 12 * 3600, label: '12 horas', type: '12:12' },
    { duration: 16 * 3600, label: '16 horas', type: '16:8' },
    { duration: 18 * 3600, label: '18 horas', type: '18:6' },
    { duration: 20 * 3600, label: '20 horas', type: '20:4' },
    { duration: 24 * 3600, label: '24 horas', type: '24:0' }
  ], []);

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <GlobalErrorBoundary level="component" name="Fasting Timer">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timer de Jejum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isActive ? (
            <>
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-primary mb-2">
                  {displayTime}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentFast?.type} - {isPaused ? 'Pausado' : 'Ativo'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{progressData.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressData.percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(progressData.elapsed)}</span>
                  <span>{formatTime(progressData.total)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {isPaused ? (
                  <Button onClick={handlePause} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Retomar
                  </Button>
                ) : (
                  <Button onClick={handlePause} variant="outline" className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                )}
                <Button onClick={handleStop} variant="destructive" className="flex-1">
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <Coffee className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Iniciar Jejum</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha a duração do seu jejum
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {quickStartOptions.map((option) => (
                  <Button
                    key={option.type}
                    onClick={() => handleStart(option.duration, option.type)}
                    variant="outline"
                    className="h-auto p-3 flex flex-col"
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.type}</span>
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </GlobalErrorBoundary>
  );
});

FastingTimer.displayName = 'FastingTimer';

export default FastingTimer;
