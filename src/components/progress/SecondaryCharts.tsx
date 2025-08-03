
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Activity } from "lucide-react";
import LightweightChart from "@/components/charts/LightweightChart";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface SecondaryChartsProps {
  weightHistory: WeightEntry[];
}

const SecondaryCharts = ({
  weightHistory
}: SecondaryChartsProps) => {
  if (weightHistory.length === 0) return null;

  // Dados para gráfico de progresso mensal
  const monthlyData = weightHistory.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleDateString('pt-BR', {
      month: 'short',
      year: '2-digit'
    });
    if (!acc[month]) {
      acc[month] = {
        month,
        weights: []
      };
    }
    acc[month].weights.push(entry.weight);
    return acc;
  }, {} as any);

  const monthlyChartData = Object.values(monthlyData).map((item: any) => ({
    label: item.month,
    value: parseFloat((item.weights.reduce((sum: number, w: number) => sum + w, 0) / item.weights.length).toFixed(1))
  }));

  // Dados para gráfico de consistência (últimos 30 dias)
  const last30Days = Array.from({
    length: 30
  }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const consistencyData = last30Days.slice(-7).map((date, index) => ({
    label: `${index + 1}`,
    value: weightHistory.some(entry => entry.date === date) ? 1 : 0
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de Progresso Mensal */}
      {monthlyChartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Progresso Mensal
            </CardTitle>
            <CardDescription>
              Peso médio por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <LightweightChart 
                data={monthlyChartData}
                height={256}
                color="#dc2626"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Consistência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Consistência (7 dias)
          </CardTitle>
          <CardDescription>
            Dias com registro de peso
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="h-64">
            <LightweightChart 
              data={consistencyData}
              height={256}
              color="#10b981"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecondaryCharts;
