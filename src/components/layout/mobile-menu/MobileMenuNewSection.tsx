
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
        className={`mobile-menu-item mobile-menu-featured w-full flex items-center space-x-3 text-left transition-all duration-200 ${
          activeTab === 'new-features' ? 'active' : ''
        }`}
      >
        <div className="mobile-menu-icon">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="flex-1 font-medium">Novidades</span>
        <div className="text-xs bg-white/30 px-2 py-0.5 rounded-full">
          NOVO
        </div>
      </button>
    </div>
  );
};

export default MobileMenuNewSection;
