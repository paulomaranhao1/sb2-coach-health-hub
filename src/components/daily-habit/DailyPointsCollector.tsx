
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

const DailyPointsCollector = () => {
  const { addPoints, dailyPointsClaimed } = useGamification();

  const handleCollectPoints = () => {
    addPoints(10, "Pontos diários coletados!");
  };

  return (
    <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-600">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-200 flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            Pontos Diários
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Colete seus pontos diários para subir de nível!
          </p>
          <Button 
            onClick={handleCollectPoints}
            disabled={dailyPointsClaimed}
            className={`w-full font-bold ${
              dailyPointsClaimed 
                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            }`}
          >
            <Gift className="w-4 h-4 mr-2" />
            {dailyPointsClaimed ? "Pontos já coletados hoje! 🎯" : "Coletar 10 Pontos Diários 🎉"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPointsCollector;
