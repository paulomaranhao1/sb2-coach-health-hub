
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const WeeklyAdherenceChart = () => {
  const weeklyData = [
    { day: 'Seg', weight: 73.2, taken: 2 },
    { day: 'Ter', weight: 73.0, taken: 2 },
    { day: 'Qua', weight: 72.8, taken: 2 },
    { day: 'Qui', weight: 72.9, taken: 1 },
    { day: 'Sex', weight: 72.6, taken: 2 },
    { day: 'Sáb', weight: 72.5, taken: 2 },
    { day: 'Dom', weight: 72.4, taken: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aderência Semanal</CardTitle>
        <CardDescription>
          Peso diário e cápsulas tomadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'taken' ? `${value} cápsulas` : `${value} kg`,
                  name === 'taken' ? 'Cápsulas' : 'Peso'
                ]}
              />
              <Bar dataKey="taken" fill="#dc2626" name="taken" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyAdherenceChart;
