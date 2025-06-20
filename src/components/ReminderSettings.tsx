
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ReminderSettings = () => {
  const [reminderEnabled, setReminderEnabled] = useState(() => {
    return localStorage.getItem('sb2_reminders_enabled') !== 'false';
  });
  
  const [visualAlert, setVisualAlert] = useState(() => {
    return localStorage.getItem('sb2_visual_alert') !== 'false';
  });

  const handleReminderToggle = (enabled: boolean) => {
    setReminderEnabled(enabled);
    localStorage.setItem('sb2_reminders_enabled', enabled.toString());
    toast.success(enabled ? 'Lembretes ativados!' : 'Lembretes desativados!');
  };

  const handleVisualAlertToggle = (enabled: boolean) => {
    setVisualAlert(enabled);
    localStorage.setItem('sb2_visual_alert', enabled.toString());
    toast.success(enabled ? 'Alerta visual ativado!' : 'Alerta visual desativado!');
  };

  const clearReminderHistory = () => {
    localStorage.removeItem('sb2_taken_reminders');
    toast.success('Histórico de lembretes limpo!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações de Lembretes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Ativar Lembretes
            </Label>
            <p className="text-xs text-muted-foreground">
              Mostrar lembretes de SB2 TURBO no cabeçalho
            </p>
          </div>
          <Switch
            checked={reminderEnabled}
            onCheckedChange={handleReminderToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              {visualAlert ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              Alerta Visual Piscante
            </Label>
            <p className="text-xs text-muted-foreground">
              Botão piscante para lembretes pendentes
            </p>
          </div>
          <Switch
            checked={visualAlert}
            onCheckedChange={handleVisualAlertToggle}
            disabled={!reminderEnabled}
          />
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearReminderHistory}
            className="w-full"
          >
            Limpar Histórico de Lembretes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;
