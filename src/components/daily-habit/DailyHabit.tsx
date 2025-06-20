
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import QuickWeightEntry from "./QuickWeightEntry";
import WaterTracker from "./WaterTracker";
import CapsuleButtons from "./CapsuleButtons";
import FirstMealTracker from "./FirstMealTracker";
import MotivationalSection from "./MotivationalSection";
import SupplementInfo from "./SupplementInfo";
import InstructionsDialog from "./InstructionsDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const DailyHabit = () => {
  const { profile } = useUserProfile();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Verificar se as instruções devem ser exibidas automaticamente
    const dismissed = localStorage.getItem('sb2_instructions_dismissed');
    if (!dismissed) {
      setShowInstructions(true);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Botão compacto para instruções */}
      <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                📋 Rotina Diária - Siga a ordem dos botões
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstructions(true)}
              className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              Ver instruções
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog com instruções detalhadas */}
      <InstructionsDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />

      {/* Sequência de botões conforme solicitado - Registrar Peso em primeiro */}
      <QuickWeightEntry />
      <WaterTracker />
      
      {/* SB2 TURBO separados */}
      <div className="space-y-4">
        {/* SB2 TURBO Manhã */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
          <CardContent className="p-4">
            <CapsuleButtons type="morning" />
          </CardContent>
        </Card>
        
        <FirstMealTracker />
        
        {/* SB2 TURBO Noite */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
          <CardContent className="p-4">
            <CapsuleButtons type="evening" />
          </CardContent>
        </Card>
      </div>

      <MotivationalSection />
      <SupplementInfo />
    </div>
  );
};

export default DailyHabit;
