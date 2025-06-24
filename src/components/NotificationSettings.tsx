
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff } from "lucide-react";
import { useNotificationService } from "@/hooks/useNotificationService";

const NotificationSettings = () => {
  const { 
    permission, 
    settings, 
    isSupported,
    requestPermission, 
    saveSettings, 
    startNotificationSchedule 
  } = useNotificationService();

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      await startNotificationSchedule();
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    
    // Restart schedule if permission is granted
    if (permission === 'granted') {
      startNotificationSchedule();
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Notificações não suportadas
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Configure lembretes para manter sua rotina em dia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status das permissões */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-3">
            {permission === 'granted' ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">
                {permission === 'granted' ? 'Notificações Ativadas' : 'Notificações Desativadas'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {permission === 'granted' 
                  ? 'Você receberá lembretes importantes'
                  : 'Ative para receber lembretes'
                }
              </p>
            </div>
          </div>
          {permission !== 'granted' && (
            <Button onClick={handlePermissionRequest} size="sm">
              Ativar
            </Button>
          )}
        </div>

        {/* Configurações individuais */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weight-reminder">Lembrete de Pesagem</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembrete diário às 8h para registrar o peso
              </p>
            </div>
            <Switch
              id="weight-reminder"
              checked={settings.weightReminder}
              onCheckedChange={(checked) => handleSettingChange('weightReminder', checked)}
              disabled={permission !== 'granted'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="supplement-reminder">Lembrete de Suplemento</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembrete nos horários configurados para tomar o SB2 Turbo
              </p>
            </div>
            <Switch
              id="supplement-reminder"
              checked={settings.supplementReminder}
              onCheckedChange={(checked) => handleSettingChange('supplementReminder', checked)}
              disabled={permission !== 'granted'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="streak-reminder">Lembrete de Sequência</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembrete às 20h para não perder a sequência
              </p>
            </div>
            <Switch
              id="streak-reminder"
              checked={settings.streakReminder}
              onCheckedChange={(checked) => handleSettingChange('streakReminder', checked)}
              disabled={permission !== 'granted'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="motivational-messages">Mensagens Motivacionais</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mensagens de motivação ao longo do dia
              </p>
            </div>
            <Switch
              id="motivational-messages"
              checked={settings.motivationalMessages}
              onCheckedChange={(checked) => handleSettingChange('motivationalMessages', checked)}
              disabled={permission !== 'granted'}
            />
          </div>
        </div>

        {permission === 'granted' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Bell className="w-4 h-4" />
              <span className="font-semibold">Notificações Configuradas!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Você receberá lembretes de acordo com suas preferências.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
