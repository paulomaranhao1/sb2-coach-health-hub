
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/utils/logger';

interface VideoWelcomeScreenProps {
  onVideoComplete: () => void;
}

const VideoWelcomeScreen = ({ onVideoComplete }: VideoWelcomeScreenProps) => {
  const logger = useLogger('VideoWelcomeScreen');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

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
      logger.info('VideoWelcomeScreen unmounted');
    };
  }, [onVideoComplete, logger]);

  useEffect(() => {
    // Simular fim do vídeo após 30 segundos (duração aproximada do vídeo)
    const videoEndTimeout = setTimeout(() => {
      if (!showFallback) {
        logger.info('Video completed, transitioning to next screen');
        onVideoComplete();
      }
    }, 30000);

    return () => clearTimeout(videoEndTimeout);
  }, [onVideoComplete, showFallback, logger]);

  const handleIframeLoad = () => {
    logger.info('Video iframe loaded');
    setIsVideoLoaded(true);
    // Limpar timeout de fallback quando o vídeo carrega
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
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
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* YouTube Video */}
      <iframe
        src="https://www.youtube.com/embed/q2LekXTRawU?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&mute=0"
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={handleIframeLoad}
        title="SB2coach.ai - Vídeo de Boas-vindas"
      />

      {/* Fade overlay for smooth transition */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />
    </div>
  );
};

export default VideoWelcomeScreen;
