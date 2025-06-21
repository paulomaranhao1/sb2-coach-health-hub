
import { User, Settings, Target } from "lucide-react";

interface MobileMenuUserSectionProps {
  activeTab: string;
  handleProfileClick: () => void;
  handleSettingsClick: () => void;
  handleRoadmapClick: () => void;
}

const MobileMenuUserSection = ({
  activeTab,
  handleProfileClick,
  handleSettingsClick,
  handleRoadmapClick
}: MobileMenuUserSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 text-xs uppercase font-semibold px-3">Usuário</h3>
      
      <button
        onClick={handleProfileClick}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
          activeTab === 'profile' 
            ? 'bg-red-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Perfil</span>
      </button>

      <button
        onClick={handleSettingsClick}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
          activeTab === 'settings' 
            ? 'bg-red-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span>Configurações</span>
      </button>

      <button
        onClick={handleRoadmapClick}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
          activeTab === 'roadmap' 
            ? 'bg-red-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Target className="w-5 h-5" />
        <span>Roadmap</span>
      </button>
    </div>
  );
};

export default MobileMenuUserSection;
