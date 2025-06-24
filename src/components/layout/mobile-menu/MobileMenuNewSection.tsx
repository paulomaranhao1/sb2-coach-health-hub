
import { Sparkles } from "lucide-react";

interface MobileMenuNewSectionProps {
  activeTab: string;
  handleNewFeaturesClick: () => void;
}

const MobileMenuNewSection = ({ activeTab, handleNewFeaturesClick }: MobileMenuNewSectionProps) => {
  return (
    <div className="space-y-1">
      <button
        onClick={handleNewFeaturesClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white shadow-lg shadow-yellow-500/20 border border-yellow-400/30 hover:from-yellow-400 hover:to-orange-400 ${
          activeTab === 'new-features' ? 'ring-2 ring-white/50' : ''
        }`}
      >
        <div className="p-1.5 rounded-lg bg-white/20">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <span className="font-bold">Novidades</span>
        <div className="ml-auto">
          <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full animate-bounce">
            NOVO
          </span>
        </div>
      </button>
    </div>
  );
};

export default MobileMenuNewSection;
