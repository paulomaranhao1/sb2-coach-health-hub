
const VideoLoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-center space-y-4 px-4">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white text-lg font-medium">Carregando experiência...</p>
      </div>
    </div>
  );
};

export default VideoLoadingState;
