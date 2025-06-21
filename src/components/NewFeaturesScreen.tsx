
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
        <FeaturesGrid />
        <PremiumAccessCard onShowOffers={() => setShowOffers(true)} />
      </div>
    </div>
  );
};

export default NewFeaturesScreen;
