
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

const WeightTracker = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWeightHistory();
  }, []);

  const loadWeightHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      setWeightHistory(data || []);
    } catch (error) {
      console.error('Error loading weight history:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de peso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!currentWeight) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('weight_entries')
        .insert({
          user_id: user.id,
          weight: parseFloat(currentWeight),
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      await loadWeightHistory();
      setCurrentWeight("");
      
      toast({
        title: "Peso registrado!",
        description: `Peso de ${currentWeight}kg foi adicionado ao seu histórico`
      });
    } catch (error: any) {
      console.error('Error adding weight:', error);
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "weight_entries_user_id_date_key"' 
          ? "Você já registrou seu peso hoje"
          : "Não foi possível adicionar o peso",
        variant: "destructive"
      });
    }
  };

  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: entry.weight
  }));

  const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const weightLoss = initialWeight - currentWeightValue;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

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

      {weightHistory.length > 0 && (
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
                <LineChart data={chartData}>
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
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weightHistory.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso inicial:</span>
                  <span className="font-semibold">{initialWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso atual:</span>
                  <span className="font-semibold">{currentWeightValue} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{weightLoss >= 0 ? 'Perdidos:' : 'Ganhos:'}</span>
                  <span className={`font-semibold ${weightLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weightLoss >= 0 ? '-' : '+'}{Math.abs(weightLoss).toFixed(1)} kg
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center">
                Registre seu primeiro peso para ver as estatísticas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Motivação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              {weightHistory.length > 0 && weightLoss > 0 ? (
                <>
                  <div className="text-3xl">🎉</div>
                  <p className="text-sm text-gray-600">
                    Parabéns! Você já perdeu <span className="font-semibold text-blue-600">{weightLoss.toFixed(1)}kg</span> com o SB2 Turbo!
                  </p>
                  <p className="text-xs text-gray-500">
                    Continue assim e alcance sua meta!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl">💪</div>
                  <p className="text-sm text-gray-600">
                    Comece sua jornada registrando seu peso atual!
                  </p>
                  <p className="text-xs text-gray-500">
                    Cada passo conta para alcançar seus objetivos.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeightTracker;
