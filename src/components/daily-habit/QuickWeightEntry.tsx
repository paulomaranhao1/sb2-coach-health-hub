import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Weight, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
const QuickWeightEntry = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [todayRegistered, setTodayRegistered] = useState(false);
  const {
    toast
  } = useToast();

  // Função para formatar a data
  const getFormattedDate = () => {
    const today = new Date();
    const daysOfWeek = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const dayName = daysOfWeek[today.getDay()];
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    return `${dayName}, ${day}/${month}/${year}`;
  };

  // Função para adicionar o peso
  const handleAddWeight = async () => {
    if (!currentWeight) return;
    setIsRegistering(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        error
      } = await supabase.from('weight_entries').insert({
        user_id: user.id,
        weight: parseFloat(currentWeight),
        date: new Date().toISOString().split('T')[0]
      });
      if (error) throw error;
      setCurrentWeight("");
      setTodayRegistered(true);
      toast({
        title: "✅ Peso registrado!",
        description: `Peso de ${currentWeight}kg foi adicionado ao seu histórico`,
        duration: 3000
      });
    } catch (error: any) {
      console.error('Error adding weight:', error);
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "weight_entries_user_id_date_key"' ? "Você já registrou seu peso hoje" : "Não foi possível adicionar o peso",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };
  return <Card className="border-2 border-red-800 bg-gradient-to-r from-red-500 to-red-800 shadow-lg">
      <CardHeader className="text-center pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-xl text-red-700">
          <Weight className="w-6 h-6" />
          Registrar Peso Hoje {getFormattedDate()}
        </CardTitle>
        {todayRegistered && <p className="text-sm text-green-600 font-semibold">✅ Peso já registrado hoje!</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="quick-weight" className="text-sm font-semibold text-slate-600">
              Peso atual (kg)
            </Label>
            <Input id="quick-weight" type="number" step="0.1" placeholder="Ex: 70.5" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} className="border-2 border-gray-200 focus:border-red-500 bg-white text-slate-600" disabled={todayRegistered} />
          </div>
          <Button onClick={handleAddWeight} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 font-bold" disabled={!currentWeight || todayRegistered || isRegistering}>
            {isRegistering ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Plus className="w-4 h-4 mr-1" />}
            {todayRegistered ? "Registrado" : "Registrar"}
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default QuickWeightEntry;