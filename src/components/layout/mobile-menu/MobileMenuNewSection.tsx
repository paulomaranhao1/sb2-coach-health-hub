
import { Sparkles } from "lucide-react";

interface MobileMenuNewSectionProps {
  activeTab: string;
  handleNewFeaturesClick: () => void;
}

const MobileMenuNewSection = ({ activeTab, handleNewFeaturesClick }: MobileMenuNewSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 text-xs uppercase font-semibold px-3">Novo</h3>
      
      <button
        onClick={handleNewFeaturesClick}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg ${
          activeTab === 'new-features' ? 'ring-2 ring-white' : ''
        }`}
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-bold">Novidades</span>
      </button>
    </div>
  );
};

export default MobileMenuNewSection;
