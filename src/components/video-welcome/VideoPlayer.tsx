
import { forwardRef } from 'react';

interface VideoPlayerProps {
  onLoadedData: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onError: (error: any) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  onLoadedData,
  onPlay,
  onPause,
  onEnded,
  onError
}, ref) => {
  return (
    <video
      ref={ref}
      className="w-full h-full max-w-full max-h-full object-contain sm:object-cover"
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedData={onLoadedData}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
      onError={onError}
    >
      <source src="https://sb2coach.ai/sb2coach_splash_screen_final.mp4" type="video/mp4" />
      Seu navegador não suporta reprodução de vídeo.
    </video>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
