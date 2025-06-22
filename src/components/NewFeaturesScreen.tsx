
import { useState } from "react";
import OffersScreen from "./OffersScreen";
import NewFeaturesHeader from "./new-features/NewFeaturesHeader";
import FeaturesGrid from "./new-features/FeaturesGrid";
import PremiumAccessCard from "./new-features/PremiumAccessCard";

interface NewFeaturesScreenProps {
  onBack: () => void;
}

const NewFeaturesScreen = ({ onBack }: NewFeaturesScreenProps) => {
  const [showOffers, setShowOffers] = useState(false);

  if (showOffers) {
    return <OffersScreen onBack={() => setShowOffers(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 p-4">
      <div className="max-w-4xl mx-auto">
        <NewFeaturesHeader onBack={onBack} />
        
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              🚀 Recursos em Desenvolvimento
            </h2>
            <p className="text-white/90 text-lg">
              Estamos trabalhando em funcionalidades incríveis que estarão disponíveis em breve!
            </p>
          </div>
        </div>
        
        <FeaturesGrid />
        <PremiumAccessCard onShowOffers={() => setShowOffers(true)} />
      </div>
    </div>
  );
};

export default NewFeaturesScreen;
