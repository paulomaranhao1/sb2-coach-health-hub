
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
        className={`mobile-menu-item w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md group bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30 hover:from-blue-400 hover:to-blue-500 ${
          activeTab === 'new-features' ? 'ring-2 ring-blue-300' : ''
        }`}
      >
        <div className="p-1.5 rounded-md bg-white/20">
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
