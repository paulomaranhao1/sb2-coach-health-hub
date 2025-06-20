
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Calendar, Activity } from "lucide-react";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface SecondaryChartsProps {
  weightHistory: WeightEntry[];
}

const SecondaryCharts = ({ weightHistory }: SecondaryChartsProps) => {
  if (weightHistory.length === 0) return null;

  // Dados para gráfico de progresso mensal
  const monthlyData = weightHistory.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, weights: [] };
    }
    acc[month].weights.push(entry.weight);
    return acc;
  }, {} as any);

  const monthlyChartData = Object.values(monthlyData).map((item: any) => ({
    month: item.month,
    avgWeight: (item.weights.reduce((sum: number, w: number) => sum + w, 0) / item.weights.length).toFixed(1),
    minWeight: Math.min(...item.weights),
    maxWeight: Math.max(...item.weights)
  }));

  // Dados para gráfico de consistência (últimos 30 dias)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const consistencyData = last30Days.map(date => ({
    date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    recorded: weightHistory.some(entry => entry.date === date) ? 1 : 0
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, 'Peso Médio']}
                  />
                  <Bar dataKey="avgWeight" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Consistência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Consistência (30 dias)
          </CardTitle>
          <CardDescription>
            Dias com registro de peso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consistencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 1]} />
                <Tooltip 
                  formatter={(value) => [value ? 'Registrado' : 'Não registrado', 'Status']}
                />
                <Bar 
                  dataKey="recorded" 
                  fill="#10b981" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecondaryCharts;
