
import { Button } from '@/components/ui/button';
import { SkipForward, Play, Pause } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  showSkipButton: boolean;
  onTogglePlayPause: () => void;
  onSkip: () => void;
}

const VideoControls = ({ 
  isPlaying, 
  showSkipButton, 
  onTogglePlayPause, 
  onSkip 
}: VideoControlsProps) => {
  return (
    <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex items-center space-x-2 sm:space-x-3">
      {/* Play/Pause button */}
      <Button
        onClick={onTogglePlayPause}
        variant="outline"
        size="sm"
        className="bg-black/30 border-white/30 text-white hover:bg-black/50 backdrop-blur-sm w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <Play className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </Button>

      {/* Skip button */}
      {showSkipButton && (
        <Button
          onClick={onSkip}
          variant="outline"
          size="sm"
          className="bg-black/30 border-white/30 text-white hover:bg-black/50 backdrop-blur-sm animate-fade-in text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
        >
          <SkipForward className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Pular
        </Button>
      )}
    </div>
  );
};

export default VideoControls;
