
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
  const userItems = [
    { key: 'profile', label: 'Perfil', icon: User, onClick: handleProfileClick },
    { key: 'settings', label: 'Configurações', icon: Settings, onClick: handleSettingsClick },
    { key: 'roadmap', label: 'Roadmap', icon: Target, onClick: handleRoadmapClick }
  ];

  return (
    <div className="space-y-1">
      {userItems.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group ${
            activeTab === item.key 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 border border-red-400/30' 
              : 'text-gray-300 hover:bg-slate-700/70 hover:text-white border border-transparent hover:border-slate-600/50'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${
            activeTab === item.key 
              ? 'bg-white/20' 
              : 'bg-slate-600/50 group-hover:bg-slate-500/50'
          }`}>
            <item.icon className="w-4 h-4" />
          </div>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileMenuUserSection;
