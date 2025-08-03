
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LightweightChart from "@/components/charts/LightweightChart";

const WeeklyAdherenceChart = () => {
  const weeklyData = [
    { day: 'Seg', weight: 73.2, taken: 2 },
    { day: 'Ter', weight: 73.0, taken: 2 },
    { day: 'Qua', weight: 72.8, taken: 2 },
    { day: 'Qui', weight: 72.9, taken: 1 },
    { day: 'Sex', weight: 72.6, taken: 2 },
    { day: 'Sáb', weight: 72.5, taken: 2 },
    { day: 'Dom', weight: 72.4, taken: 2 }
  ];

  const chartData = weeklyData.map(item => ({
    label: item.day,
    value: item.taken
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aderência Semanal</CardTitle>
        <CardDescription>
          Cápsulas tomadas por dia
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 px-0">
        <div className="h-64">
          <LightweightChart 
            data={chartData}
            height={256}
            color="#dc2626"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyAdherenceChart;
