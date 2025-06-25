import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Target } from "lucide-react";
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
  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    }),
    weight: entry.weight,
    fullDate: entry.date
  }));
  return <Card>
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip formatter={value => [`${value} kg`, 'Peso']} labelFormatter={label => `Data: ${label}`} />
              <Area type="monotone" dataKey="weight" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#weightGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>;
};
export default WeightEvolutionChart;