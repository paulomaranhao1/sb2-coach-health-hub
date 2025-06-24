
import { Sparkles } from "lucide-react";

interface MobileMenuNewSectionProps {
  activeTab: string;
  handleNewFeaturesClick: () => void;
}

const MobileMenuNewSection = ({ activeTab, handleNewFeaturesClick }: MobileMenuNewSectionProps) => {
  return (
    <div className="space-y-2">
      <button
        onClick={handleNewFeaturesClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30 hover:from-emerald-400 hover:to-teal-500 ${
          activeTab === 'new-features' ? 'ring-2 ring-white/50' : ''
        }`}
      >
        <div className="p-2 rounded-lg bg-white/20">
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
