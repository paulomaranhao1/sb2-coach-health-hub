
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import QuickWeightEntry from "./QuickWeightEntry";
import WaterTracker from "./WaterTracker";
import SupplementTracker from "./SupplementTracker";
import MotivationalSection from "./MotivationalSection";
import InstructionsDialog from "./InstructionsDialog";
import InstructionsHeader from "./InstructionsHeader";
import DailyPointsCollector from "./DailyPointsCollector";

const DailyHabit = () => {
  const { profile } = useUserProfile();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('sb2_instructions_dismissed');
    if (!dismissed) {
      setShowInstructions(true);
    }
  }, []);

  return (
    <div className="space-y-6">
      <InstructionsHeader onShowInstructions={() => setShowInstructions(true)} />

      <InstructionsDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />

      <QuickWeightEntry />
      <WaterTracker />
      
      <SupplementTracker />

      <MotivationalSection />

      <DailyPointsCollector />
    </div>
  );
};

export default DailyHabit;
