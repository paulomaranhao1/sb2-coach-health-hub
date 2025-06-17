
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from "lucide-react";

const WeightTracker = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightHistory, setWeightHistory] = useState([
    { date: "01/01", weight: 75.2 },
    { date: "08/01", weight: 74.8 },
    { date: "15/01", weight: 73.9 },
    { date: "22/01", weight: 73.1 },
    { date: "29/01", weight: 72.5 },
  ]);

  const handleAddWeight = () => {
    if (currentWeight) {
      const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      setWeightHistory([...weightHistory, { date: today, weight: parseFloat(currentWeight) }]);
      setCurrentWeight("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Registrar Peso
          </CardTitle>
          <CardDescription>
            Adicione seu peso atual para acompanhar o progresso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="weight">Peso atual (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
              />
            </div>
            <Button onClick={handleAddWeight} className="bg-blue-600 hover:bg-blue-700">
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Evolução</CardTitle>
          <CardDescription>
            Sua jornada de emagrecimento com SB2 Turbo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Peso']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Peso inicial:</span>
              <span className="font-semibold">75.2 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peso atual:</span>
              <span className="font-semibold">72.5 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Perdidos:</span>
              <span className="font-semibold text-green-600">-2.7 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IMC atual:</span>
              <span className="font-semibold">24.1</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Motivação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl">🎉</div>
              <p className="text-sm text-gray-600">
                Parabéns! Você já perdeu <span className="font-semibold text-blue-600">2.7kg</span> com o SB2 Turbo!
              </p>
              <p className="text-xs text-gray-500">
                Continue assim e alcance sua meta!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeightTracker;
