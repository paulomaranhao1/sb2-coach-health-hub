
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  weightReminder: boolean;
  supplementReminder: boolean;
  streakReminder: boolean;
  motivationalMessages: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    weightReminder: true,
    supplementReminder: true,
    streakReminder: true,
    motivationalMessages: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações",
        variant: "destructive"
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      toast({
        title: "✅ Notificações ativadas!",
        description: "Você receberá lembretes importantes"
      });
      return true;
    } else {
      toast({
        title: "Notificações negadas",
        description: "Você pode ativar nas configurações do navegador",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendNotification = (title: string, body: string, icon?: string) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      tag: 'sb2fit-reminder',
      requireInteraction: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => {
      notification.close();
    }, 10000);
  };

  const scheduleWeightReminder = () => {
    if (!settings.weightReminder) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0); // 8h da manhã

    const timeUntilReminder = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      sendNotification(
        "🏋️ Hora de se pesar!",
        "Registre seu peso hoje e ganhe +10 pontos no SB2FIT!"
      );
      scheduleWeightReminder(); // Reagendar para o próximo dia
    }, timeUntilReminder);
  };

  const scheduleSupplementReminder = () => {
    if (!settings.supplementReminder) return;

    const now = new Date();
    const nextReminder = new Date(now);
    nextReminder.setHours(nextReminder.getHours() + 6); // A cada 6 horas

    const timeUntilReminder = nextReminder.getTime() - now.getTime();

    setTimeout(() => {
      sendNotification(
        "💊 Hora do suplemento!",
        "Não esqueça de tomar seu SB2 Turbo!"
      );
      scheduleSupplementReminder(); // Reagendar
    }, timeUntilReminder);
  };

  const scheduleStreakReminder = () => {
    if (!settings.streakReminder) return;

    const now = new Date();
    const evening = new Date(now);
    evening.setHours(20, 0, 0, 0); // 20h

    if (evening <= now) {
      evening.setDate(evening.getDate() + 1);
    }

    const timeUntilReminder = evening.getTime() - now.getTime();

    setTimeout(() => {
      sendNotification(
        "🔥 Mantenha sua sequência!",
        "Você ainda não registrou nada hoje. Não perca sua sequência!"
      );
      scheduleStreakReminder(); // Reagendar para o próximo dia
    }, timeUntilReminder);
  };

  const scheduleMotivationalMessage = () => {
    if (!settings.motivationalMessages) return;

    const messages = [
      "💪 Você está indo muito bem! Continue assim!",
      "🎯 Cada dia é uma nova oportunidade de progresso!",
      "🔥 Sua determinação é inspiradora!",
      "⭐ Pequenos passos levam a grandes conquistas!",
      "🏆 Você é mais forte do que imagina!"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setTimeout(() => {
      sendNotification(
        "🌟 Mensagem motivacional",
        randomMessage
      );
      
      // Reagendar para 24 horas depois
      setTimeout(scheduleMotivationalMessage, 24 * 60 * 60 * 1000);
    }, 12 * 60 * 60 * 1000); // 12 horas
  };

  const startNotificationSchedule = () => {
    if (permission === 'granted') {
      scheduleWeightReminder();
      scheduleSupplementReminder();
      scheduleStreakReminder();
      scheduleMotivationalMessage();
    }
  };

  return {
    permission,
    settings,
    requestPermission,
    saveSettings,
    sendNotification,
    startNotificationSchedule
  };
};
