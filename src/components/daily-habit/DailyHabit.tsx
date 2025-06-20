
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import QuickWeightEntry from "./QuickWeightEntry";
import WaterTracker from "./WaterTracker";
import CapsuleButtons from "./CapsuleButtons";
import FirstMealTracker from "./FirstMealTracker";
import MotivationalSection from "./MotivationalSection";
import InstructionsDialog from "./InstructionsDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

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
      {/* Botão de instruções com cores do tema */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-blue-800 dark:text-blue-200">
                📋 Rotina Diária - Siga a ordem dos botões
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstructions(true)}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30 font-bold"
            >
              Ver instruções
            </Button>
          </div>
        </CardContent>
      </Card>

      <InstructionsDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />

      {/* Sequência de componentes */}
      <QuickWeightEntry />
      <WaterTracker />
      
      {/* SB2 TURBO com cores harmoniosas */}
      <div className="space-y-4">
        {/* SB2 TURBO Manhã */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <CapsuleButtons type="morning" />
          </CardContent>
        </Card>
        
        <FirstMealTracker />
        
        {/* SB2 TURBO Noite */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <CardContent className="p-4">
            <CapsuleButtons type="evening" />
          </CardContent>
        </Card>
      </div>

      <MotivationalSection />
    </div>
  );
};

export default DailyHabit;
