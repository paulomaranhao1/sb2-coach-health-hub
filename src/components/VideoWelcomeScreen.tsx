
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/utils/logger';

interface VideoWelcomeScreenProps {
  onVideoComplete: () => void;
}

const VideoWelcomeScreen = ({ onVideoComplete }: VideoWelcomeScreenProps) => {
  const logger = useLogger('VideoWelcomeScreen');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    logger.info('VideoWelcomeScreen mounted');
    
    // Fallback timeout de 10 segundos
    timeoutRef.current = setTimeout(() => {
      logger.warn('Video timeout reached, proceeding to next screen');
      setShowFallback(true);
      onVideoComplete();
    }, 10000);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      logger.info('VideoWelcomeScreen unmounted');
    };
  }, [onVideoComplete, logger]);

  const handleVideoLoaded = () => {
    logger.info('Video loaded and ready to play');
    setIsVideoLoaded(true);
    
    // Limpar timeout de fallback quando o vídeo está pronto
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Obter duração do vídeo para calcular fade-out
    const video = videoRef.current;
    if (video && video.duration) {
      const duration = video.duration;
      const fadeStartTime = Math.max(duration - 3, duration * 0.85); // 3 segundos antes do fim ou 85% da duração
      
      // Iniciar fade-out baseado na duração do vídeo
      fadeTimeoutRef.current = setTimeout(() => {
        logger.info('Starting fade out transition');
        setShowFadeOut(true);
      }, fadeStartTime * 1000);
    }
  };

  const handleVideoEnded = () => {
    logger.info('Video ended, transitioning to next screen');
    onVideoComplete();
  };

  const handleVideoError = (error: any) => {
    logger.error('Video error', { error });
    setShowFallback(true);
    onVideoComplete();
  };

  if (showFallback) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Loading state */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        >
          <source src="https://sb2coach.ai/sb2coach_splash_screen_final.mp4" type="video/mp4" />
          Seu navegador não suporta reprodução de vídeo.
        </video>
      </div>

      {/* Fade overlay for smooth transition */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* Fade out overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-3000 pointer-events-none ${
          showFadeOut ? 'opacity-100' : 'opacity-0'
        }`} 
      />
    </div>
  );
};

export default VideoWelcomeScreen;
