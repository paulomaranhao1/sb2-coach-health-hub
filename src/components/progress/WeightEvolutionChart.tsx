
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import LightweightChart from "@/components/charts/LightweightChart";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface WeightEvolutionChartProps {
  weightHistory: WeightEntry[];
}

const WeightEvolutionChart = ({
  weightHistory
}: WeightEvolutionChartProps) => {
  if (weightHistory.length === 0) return null;

  const chartData = weightHistory.slice(-10).map(entry => ({
    label: new Date(entry.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    }),
    value: entry.weight
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Evolução do Peso
        </CardTitle>
        <CardDescription>
          Sua jornada de emagrecimento ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent className="px-[5px]">
        <div className="h-80">
          <LightweightChart 
            data={chartData}
            type="line"
            height={320}
            color="#dc2626"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightEvolutionChart;
