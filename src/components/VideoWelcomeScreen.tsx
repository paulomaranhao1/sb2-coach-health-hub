
import { useEffect, useState, useRef } from 'react';
import { useAdvancedLogger } from '@/utils/advancedLogger';
import { Button } from '@/components/ui/button';
import { SkipForward, Play, Pause } from 'lucide-react';

interface VideoWelcomeScreenProps {
  onVideoComplete: () => void;
}

const VideoWelcomeScreen = ({ onVideoComplete }: VideoWelcomeScreenProps) => {
  const logger = useAdvancedLogger('VideoWelcomeScreen');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();
  const skipTimeoutRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const timer = logger.startTimer('VideoWelcomeScreen lifecycle');
    logger.info('VideoWelcomeScreen mounted');
    
    // Fallback timeout de 15 segundos
    timeoutRef.current = setTimeout(() => {
      logger.warn('Video timeout reached, proceeding to next screen');
      setShowFallback(true);
      onVideoComplete();
    }, 15000);

    // Mostrar botão skip após 3 segundos
    skipTimeoutRef.current = setTimeout(() => {
      logger.info('Skip button now available');
      setShowSkipButton(true);
    }, 3000);

    // Cleanup function
    return () => {
      timer();
      [timeoutRef, fadeTimeoutRef, skipTimeoutRef, progressIntervalRef].forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
      logger.info('VideoWelcomeScreen unmounted');
    };
  }, [onVideoComplete, logger]);

  const startProgressTracking = () => {
    progressIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (video && video.duration) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleVideoLoaded = () => {
    logger.info('Video loaded and ready to play');
    setIsVideoLoaded(true);
    setCanPlay(true);
    
    // Limpar timeout de fallback quando o vídeo está pronto
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const video = videoRef.current;
    if (video && video.duration) {
      const duration = video.duration;
      const fadeStartTime = Math.max(duration - 2, duration * 0.9);
      
      logger.info('Video duration detected', { duration, fadeStartTime });
      
      // Iniciar fade-out baseado na duração do vídeo
      fadeTimeoutRef.current = setTimeout(() => {
        logger.info('Starting fade out transition');
        setShowFadeOut(true);
      }, fadeStartTime * 1000);
    }
  };

  const handleVideoPlay = () => {
    logger.info('Video started playing');
    setIsPlaying(true);
    startProgressTracking();
  };

  const handleVideoPause = () => {
    logger.info('Video paused');
    setIsPlaying(false);
    stopProgressTracking();
  };

  const handleVideoEnded = () => {
    logger.info('Video ended, transitioning to next screen');
    stopProgressTracking();
    onVideoComplete();
  };

  const handleVideoError = (error: any) => {
    logger.error('Video error', { error });
    setShowFallback(true);
    onVideoComplete();
  };

  const handleSkip = () => {
    logger.info('User skipped video welcome screen');
    stopProgressTracking();
    onVideoComplete();
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  if (showFallback) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Loading state */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white text-lg font-medium">Carregando experiência...</p>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div className="w-full h-full relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        >
          <source src="https://sb2coach.ai/sb2coach_splash_screen_final.mp4" type="video/mp4" />
          Seu navegador não suporta reprodução de vídeo.
        </video>

        {/* Progress indicator */}
        {isVideoLoaded && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gradient-to-t from-black/50 to-transparent p-6">
              <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                <div 
                  className="bg-white rounded-full h-1 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  SB2coach.ai está iniciando...
                </div>
                <div className="text-white/60 text-xs">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        {canPlay && (
          <div className="absolute top-6 right-6 flex items-center space-x-3">
            {/* Play/Pause button */}
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size="sm"
              className="bg-black/30 border-white/30 text-white hover:bg-black/50 backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            {/* Skip button */}
            {showSkipButton && (
              <Button
                onClick={handleSkip}
                variant="outline"
                size="sm"
                className="bg-black/30 border-white/30 text-white hover:bg-black/50 backdrop-blur-sm animate-fade-in"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Pular
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Fade overlay for smooth loading transition */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* Fade out overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-2000 pointer-events-none ${
          showFadeOut ? 'opacity-100' : 'opacity-0'
        }`} 
      />
    </div>
  );
};

export default VideoWelcomeScreen;
