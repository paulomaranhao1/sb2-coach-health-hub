
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
    <div className="space-y-2">
      {userItems.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className={`mobile-menu-item w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md group ${
            activeTab === item.key ? 'active' : ''
          }`}
        >
          <div className="mobile-menu-icon p-2 rounded-lg">
            <item.icon className="w-4 h-4" />
          </div>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileMenuUserSection;
