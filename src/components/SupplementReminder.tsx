
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, CheckCircle } from "lucide-react";

const SupplementReminder = () => {
  const [reminders, setReminders] = useState([
    { id: 1, time: "08:00", taken: true, active: true },
    { id: 2, time: "20:00", taken: false, active: true },
  ]);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const markAsTaken = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, taken: true } : r
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            SB2 Turbo - Rotina Diária
          </CardTitle>
          <CardDescription className="text-red-100">
            2 cápsulas por dia conforme orientação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Manhã</h4>
              <p className="text-sm text-red-100">1 cápsula antes do café</p>
              <p className="text-xs text-red-200 mt-1">Horário recomendado: 08:00</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Noite</h4>
              <p className="text-sm text-red-100">1 cápsula antes do jantar</p>
              <p className="text-xs text-red-200 mt-1">Horário recomendado: 20:00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lembretes Configurados</CardTitle>
          <CardDescription>
            Gerencie seus horários de tomada do SB2 Turbo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{reminder.time}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {reminder.id === 1 ? "Manhã - 1 cápsula" : "Noite - 1 cápsula"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {reminder.taken ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Tomado
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsTaken(reminder.id)}
                  >
                    Marcar como tomado
                  </Button>
                )}
                <Switch
                  checked={reminder.active}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dicas Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-red-600 dark:text-red-400 text-lg">💧</div>
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">Hidratação</p>
              <p className="text-sm text-red-700 dark:text-red-200">Tome sempre com água e mantenha-se hidratado</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-600 dark:text-green-400 text-lg">🥗</div>
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">Alimentação</p>
              <p className="text-sm text-green-700 dark:text-green-200">Combine com alimentação balanceada para melhores resultados</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
            <div className="text-slate-600 dark:text-slate-400 text-lg">🏃‍♀️</div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Exercícios</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">Pratique atividades físicas regulares</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementReminder;
