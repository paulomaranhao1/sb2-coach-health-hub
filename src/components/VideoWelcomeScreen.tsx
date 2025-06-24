
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/utils/logger';

interface VideoWelcomeScreenProps {
  onVideoComplete: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VideoWelcomeScreen = ({ onVideoComplete }: VideoWelcomeScreenProps) => {
  const logger = useLogger('VideoWelcomeScreen');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const playerRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    logger.info('VideoWelcomeScreen mounted');
    
    // Fallback timeout de 10 segundos
    timeoutRef.current = setTimeout(() => {
      logger.warn('Video timeout reached, proceeding to next screen');
      setShowFallback(true);
      onVideoComplete();
    }, 10000);

    // Inicializar YouTube Player API
    const initYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        // Carregar YouTube API se não estiver carregada
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = createPlayer;
      }
    };

    const createPlayer = () => {
      logger.info('Creating YouTube player');
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'q2LekXTRawU',
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          playsinline: 1,
          mute: 0,
          start: 0,
          end: 28 // Parar 2 segundos antes do fim para evitar vídeos sugeridos
        },
        events: {
          onReady: (event: any) => {
            logger.info('YouTube player ready');
            setIsVideoLoaded(true);
            // Limpar timeout de fallback quando o player está pronto
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            
            // Iniciar fade-out aos 25 segundos
            fadeTimeoutRef.current = setTimeout(() => {
              logger.info('Starting fade out transition');
              setShowFadeOut(true);
            }, 25000);

            // Transição final aos 28 segundos
            transitionTimeoutRef.current = setTimeout(() => {
              logger.info('Video completed, transitioning to next screen');
              onVideoComplete();
            }, 28000);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              logger.info('Video ended, immediate transition');
              onVideoComplete();
            }
          },
          onError: (event: any) => {
            logger.error('YouTube player error', { error: event.data });
            onVideoComplete();
          }
        }
      });
    };

    initYouTubeAPI();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      logger.info('VideoWelcomeScreen unmounted');
    };
  }, [onVideoComplete, logger]);

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

      {/* YouTube Player Container */}
      <div className="w-full h-full relative">
        <div id="youtube-player" className="w-full h-full" />
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
