
import { useUserProfile } from "@/hooks/useUserProfile";
import QuickWeightEntry from "./QuickWeightEntry";
import WaterTracker from "./WaterTracker";
import CapsuleButtons from "./CapsuleButtons";
import FirstMealTracker from "./FirstMealTracker";
import MotivationalSection from "./MotivationalSection";
import SupplementInfo from "./SupplementInfo";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const DailyHabit = () => {
  const { profile } = useUserProfile();

  return (
    <div className="space-y-6">
      {/* Instruções */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                📋 Rotina Diária - Clique em cada ação conforme realizar:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Registrar Peso:</strong> Anote seu peso do dia</li>
                <li>• <strong>Hidratação:</strong> Registre copos (200ml) ou garrafas (500ml)</li>
                <li>• <strong>SB2 TURBO Manhã:</strong> Primeira dose do suplemento</li>
                <li>• <strong>Primeira Refeição:</strong> Marque quando fizer sua primeira refeição</li>
                <li>• <strong>SB2 TURBO Noite:</strong> Segunda dose do suplemento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
