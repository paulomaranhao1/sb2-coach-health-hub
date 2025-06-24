
interface VideoProgressProps {
  progress: number;
}

const VideoProgress = ({ progress }: VideoProgressProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="bg-gradient-to-t from-black/50 to-transparent p-3 sm:p-6">
        <div className="w-full bg-white/20 rounded-full h-1 mb-2 sm:mb-4">
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
  );
};

export default VideoProgress;
