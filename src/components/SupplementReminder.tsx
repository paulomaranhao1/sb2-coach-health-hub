
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
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            SB2 Turbo - Rotina Diária
          </CardTitle>
          <CardDescription className="text-blue-100">
            2 cápsulas por dia conforme orientação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Manhã</h4>
              <p className="text-sm text-blue-100">1 cápsula antes do café</p>
              <p className="text-xs text-blue-200 mt-1">Horário recomendado: 08:00</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Noite</h4>
              <p className="text-sm text-blue-100">1 cápsula antes do jantar</p>
              <p className="text-xs text-blue-200 mt-1">Horário recomendado: 20:00</p>
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
                  <p className="text-sm text-gray-600">
                    {reminder.id === 1 ? "Manhã - 1 cápsula" : "Noite - 1 cápsula"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {reminder.taken ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
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
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 text-lg">💧</div>
            <div>
              <p className="font-medium text-blue-900">Hidratação</p>
              <p className="text-sm text-blue-700">Tome sempre com água e mantenha-se hidratado</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="text-green-600 text-lg">🥗</div>
            <div>
              <p className="font-medium text-green-900">Alimentação</p>
              <p className="text-sm text-green-700">Combine com alimentação balanceada para melhores resultados</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="text-purple-600 text-lg">🏃‍♀️</div>
            <div>
              <p className="font-medium text-purple-900">Exercícios</p>
              <p className="text-sm text-purple-700">Pratique atividades físicas regulares</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementReminder;
