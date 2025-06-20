
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Moon, Sun, Smartphone, Database, Shield, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { supabase } from "@/integrations/supabase/client";

const AppSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('sb2_notifications_enabled') !== 'false';
  });
  const [sounds, setSounds] = useState(() => {
    return localStorage.getItem('sb2_sounds_enabled') !== 'false';
  });
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('sb2_auto_save') !== 'false';
  });

  const handleNotificationToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('sb2_notifications_enabled', enabled.toString());
    toastFeedback.success(enabled ? 'Notificações ativadas' : 'Notificações desativadas');
  };

  const handleSoundsToggle = (enabled: boolean) => {
    setSounds(enabled);
    localStorage.setItem('sb2_sounds_enabled', enabled.toString());
    toastFeedback.success(enabled ? 'Sons ativados' : 'Sons desativados');
  };

  const handleAutoSaveToggle = (enabled: boolean) => {
    setAutoSave(enabled);
    localStorage.setItem('sb2_auto_save', enabled.toString());
    toastFeedback.success(enabled ? 'Salvamento automático ativado' : 'Salvamento automático desativado');
  };

  const clearCache = () => {
    // Limpar dados em cache (exceto configurações essenciais)
    const keysToKeep = [
      'sb2_notifications_enabled',
      'sb2_sounds_enabled', 
      'sb2_auto_save',
      'sb2_tutorial_completed'
    ];
    
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('sb2_') && !keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    toastFeedback.success('Cache limpo com sucesso!');
  };

  const exportData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar dados do usuário
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: weightEntries } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id);

      const exportData = {
        profile,
        stats,
        weightEntries,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `sb2coach_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toastFeedback.success('Dados exportados com sucesso!');
    } catch (error) {
      toastFeedback.error('Erro ao exportar dados');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Settings className="w-8 h-8" />
            Configurações
          </CardTitle>
          <CardDescription className="text-purple-100">
            Personalize sua experiência no SB2coach.ai
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            Aparência
          </CardTitle>
          <CardDescription>
            Configure o tema e aparência do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Tema Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Alternar entre tema claro e escuro
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Gerencie como você recebe notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificações Push</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações sobre metas e lembretes
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Sons de Notificação</Label>
              <p className="text-sm text-muted-foreground">
                Reproduzir sons ao receber notificações
              </p>
            </div>
            <Switch
              checked={sounds}
              onCheckedChange={handleSoundsToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados e Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Dados e Privacidade
          </CardTitle>
          <CardDescription>
            Gerencie seus dados pessoais e configurações de privacidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Salvamento Automático</Label>
              <p className="text-sm text-muted-foreground">
                Salvar automaticamente análises de fotos
              </p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={handleAutoSaveToggle}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Button 
              onClick={exportData}
              variant="outline" 
              className="w-full justify-start"
            >
              <Database className="w-4 h-4 mr-2" />
              Exportar Meus Dados
            </Button>
            
            <Button 
              onClick={clearCache}
              variant="outline" 
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Cache do App
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
          <CardDescription>
            Configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Para alterar sua senha ou gerenciar configurações de segurança, acesse a seção de Perfil.
          </p>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Ir para Configurações de Segurança
          </Button>
        </CardContent>
      </Card>

      {/* Informações do App */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Sobre o App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Versão:</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Última atualização:</span>
            <span className="text-sm font-medium">Janeiro 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Desenvolvido por:</span>
            <span className="text-sm font-medium">SB2coach.ai</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSettings;
