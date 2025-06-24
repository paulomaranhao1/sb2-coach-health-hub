
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import ErrorBoundary from "../error/ErrorBoundary";
import { Skeleton } from "../ui/skeleton";

const DailyPointsCollector = () => {
  const { addPoints, dailyPointsClaimed, loading } = useGamification();

  const handleCollectPoints = () => {
    addPoints(10, "Pontos diários coletados!");
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <h3 className="font-bold text-blue-800 flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              Pontos Diários
            </h3>
            <p className="text-sm text-blue-700">
              Colete seus pontos diários para subir de nível!
            </p>
            <Button 
              onClick={handleCollectPoints}
              disabled={dailyPointsClaimed || loading}
              className={`w-full font-bold ${
                dailyPointsClaimed 
                  ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
              }`}
            >
              <Gift className="w-4 h-4 mr-2" />
              {dailyPointsClaimed ? "Pontos já coletados hoje! 🎯" : "Coletar 10 Pontos Diários 🎉"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default DailyPointsCollector;
