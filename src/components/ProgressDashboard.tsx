
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressDashboard = () => {
  const weeklyData = [
    { day: 'Seg', weight: 73.2, taken: 2 },
    { day: 'Ter', weight: 73.0, taken: 2 },
    { day: 'Qua', weight: 72.8, taken: 2 },
    { day: 'Qui', weight: 72.9, taken: 1 },
    { day: 'Sex', weight: 72.6, taken: 2 },
    { day: 'Sáb', weight: 72.5, taken: 2 },
    { day: 'Dom', weight: 72.4, taken: 2 },
  ];

  const goalProgress = ((75.2 - 72.5) / (75.2 - 68.0)) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Meta</CardTitle>
          <CardDescription>
            Sua jornada rumo ao peso ideal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-900 dark:text-slate-100">Peso inicial: 75.2kg</span>
              <span className="text-slate-900 dark:text-slate-100">Meta: 68.0kg</span>
            </div>
            <Progress value={goalProgress} className="h-3" />
            <div className="text-center text-sm text-slate-800 dark:text-slate-200">
              {goalProgress.toFixed(1)}% concluído
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">2.7kg</p>
              <p className="text-xs text-slate-800 dark:text-slate-200">Perdidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">4.5kg</p>
              <p className="text-xs text-slate-800 dark:text-slate-200">Restantes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">37%</p>
              <p className="text-xs text-slate-800 dark:text-slate-200">Completo</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">93%</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">Aderência</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">Dias seguidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">0.4kg</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">Perda semanal</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">24.1</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">IMC atual</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;
