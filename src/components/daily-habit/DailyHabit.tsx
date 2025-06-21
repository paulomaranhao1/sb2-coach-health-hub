
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import QuickWeightEntry from "./QuickWeightEntry";
import WaterTracker from "./WaterTracker";
import SupplementTracker from "./SupplementTracker";
import MotivationalSection from "./MotivationalSection";
import InstructionsDialog from "./InstructionsDialog";
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
      <InstructionsDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />

      <QuickWeightEntry />
      <WaterTracker />
      
      <SupplementTracker />

      <DailyPointsCollector />

      <MotivationalSection />

      {/* Botão de instruções no final */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInstructions(true)}
          className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30 font-bold"
        >
          <Info className="w-4 h-4 mr-2" />
          Ver instruções da rotina diária
        </Button>
      </div>
    </div>
  );
};

export default DailyHabit;
