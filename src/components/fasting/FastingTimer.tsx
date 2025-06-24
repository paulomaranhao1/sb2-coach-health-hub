import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, Square, Coffee } from 'lucide-react';
import { useFasting } from '@/hooks/useFasting';
import { useLogger } from '@/utils/logger';
import { useAccessibility } from '@/hooks/useAccessibility';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { ScreenReaderAnnouncer } from '@/components/ui/screen-reader-announcer';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { SkeletonCard } from '@/components/ui/skeleton-loader';
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
  
  const { containerRef, announce, announcements } = useAccessibility<HTMLDivElement>({
    announceChanges: true,
    enableKeyboardNavigation: true
  });

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

  // Memoized handlers with accessibility announcements
  const handleStart = useCallback((duration: number, type: string) => {
    logger.info('Starting fasting session', { duration, type });
    startFast(type, duration);
    announce(`Jejum de ${type} iniciado. Duração: ${Math.floor(duration / 3600)} horas`);
    enhancedToast.success('Jejum iniciado!', {
      description: `Jejum de ${type} por ${Math.floor(duration / 3600)} horas`
    });
    onFastingStart?.();
  }, [startFast, onFastingStart, logger, announce]);

  const handlePause = useCallback(() => {
    if (isPaused) {
      logger.info('Resuming fasting session');
      pauseFast();
      announce('Jejum retomado');
      enhancedToast.info('Jejum retomado');
    } else {
      logger.info('Pausing fasting session');
      pauseFast();
      announce('Jejum pausado');
      enhancedToast.warning('Jejum pausado');
    }
  }, [pauseFast, isPaused, logger, announce]);

  const handleStop = useCallback(() => {
    logger.info('Stopping fasting session');
    stopFast();
    announce('Jejum finalizado');
    enhancedToast.success('Jejum finalizado!', {
      description: 'Parabéns por completar seu jejum'
    });
    onFastingEnd?.();
  }, [stopFast, onFastingEnd, logger, announce]);

  // Memoized quick start options
  const quickStartOptions = useMemo(() => [
    { duration: 12 * 3600, label: '12 horas', type: '12:12' },
    { duration: 16 * 3600, label: '16 horas', type: '16:8' },
    { duration: 18 * 3600, label: '18 horas', type: '18:6' },
    { duration: 20 * 3600, label: '20 horas', type: '20:4' },
    { duration: 24 * 3600, label: '24 horas', type: '24:0' }
  ], []);

  if (!isLoaded) {
    return <SkeletonCard />;
  }

  return (
    <GlobalErrorBoundary level="component" name="Fasting Timer">
      <div ref={containerRef}>
        <ScreenReaderAnnouncer announcements={announcements} />
        
        <Card 
          className="w-full max-w-md mx-auto"
          role="region"
          aria-labelledby="fasting-timer-title"
        >
          <CardHeader>
            <CardTitle 
              id="fasting-timer-title"
              className="flex items-center gap-2"
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
              Timer de Jejum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isActive ? (
              <>
                <div className="text-center">
                  <div 
                    className="text-4xl font-mono font-bold text-primary mb-2"
                    role="timer"
                    aria-live="polite"
                    aria-label={`Tempo restante: ${displayTime}`}
                  >
                    {displayTime}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentFast?.type} - {isPaused ? 'Pausado' : 'Ativo'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span aria-label={`${progressData.percentage.toFixed(1)} por cento completo`}>
                      {progressData.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={progressData.percentage} 
                    className="h-2"
                    aria-label="Progresso do jejum"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span aria-label={`Tempo decorrido: ${formatTime(progressData.elapsed)}`}>
                      {formatTime(progressData.elapsed)}
                    </span>
                    <span aria-label={`Tempo total: ${formatTime(progressData.total)}`}>
                      {formatTime(progressData.total)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2" role="group" aria-label="Controles do jejum">
                  {isPaused ? (
                    <AccessibleButton 
                      onClick={handlePause} 
                      className="flex-1"
                      aria-label="Retomar jejum"
                    >
                      <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                      Retomar
                    </AccessibleButton>
                  ) : (
                    <AccessibleButton 
                      onClick={handlePause} 
                      variant="outline" 
                      className="flex-1"
                      aria-label="Pausar jejum"
                    >
                      <Pause className="w-4 h-4 mr-2" aria-hidden="true" />
                      Pausar
                    </AccessibleButton>
                  )}
                  <AccessibleButton 
                    onClick={handleStop} 
                    variant="destructive" 
                    className="flex-1"
                    aria-label="Parar jejum"
                  >
                    <Square className="w-4 h-4 mr-2" aria-hidden="true" />
                    Parar
                  </AccessibleButton>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <Coffee className="w-16 h-16 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                  <h3 className="text-lg font-semibold mb-2">Iniciar Jejum</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha a duração do seu jejum
                  </p>
                </div>

                <div 
                  className="grid grid-cols-2 gap-2"
                  role="group"
                  aria-labelledby="fasting-options-title"
                >
                  <h4 id="fasting-options-title" className="sr-only">
                    Opções de jejum disponíveis
                  </h4>
                  {quickStartOptions.map((option) => (
                    <AccessibleButton
                      key={option.type}
                      onClick={() => handleStart(option.duration, option.type)}
                      variant="outline"
                      className="h-auto p-3 flex flex-col"
                      aria-label={`Iniciar jejum de ${option.label}, tipo ${option.type}`}
                    >
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.type}</span>
                    </AccessibleButton>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </GlobalErrorBoundary>
  );
});

FastingTimer.displayName = 'FastingTimer';

export default FastingTimer;
