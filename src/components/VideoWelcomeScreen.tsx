
import { useEffect, useState, useRef } from 'react';
import { useAdvancedLogger } from '@/utils/advancedLogger';
import VideoLoadingState from './video-welcome/VideoLoadingState';
import VideoPlayer from './video-welcome/VideoPlayer';
import VideoProgress from './video-welcome/VideoProgress';
import VideoControls from './video-welcome/VideoControls';

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
      {!isVideoLoaded && <VideoLoadingState />}

      {/* Video Container - Responsivo */}
      <div className="w-full h-full relative flex items-center justify-center">
        <VideoPlayer
          ref={videoRef}
          onLoadedData={handleVideoLoaded}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        />

        {/* Progress indicator - Mobile optimized */}
        {isVideoLoaded && <VideoProgress progress={progress} />}

        {/* Controls overlay - Mobile optimized */}
        {canPlay && (
          <VideoControls
            isPlaying={isPlaying}
            showSkipButton={showSkipButton}
            onTogglePlayPause={togglePlayPause}
            onSkip={handleSkip}
          />
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
