
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface NotificationSettings {
  weightReminder: boolean;
  supplementReminder: boolean;
  streakReminder: boolean;
  motivationalMessages: boolean;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledFor: Date;
  type: 'weight' | 'supplement' | 'streak' | 'motivational';
}

export const useNotificationService = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    weightReminder: true,
    supplementReminder: true,
    streakReminder: true,
    motivationalMessages: false
  });
  const [isSupported, setIsSupported] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('sb2_notification_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        logger.error('Failed to load notification settings', { error });
      }
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Notificações não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Notificações ativadas com sucesso!');
        logger.info('Push notification permission granted');
        return true;
      } else {
        toast.error('Permissão para notificações negada');
        logger.warn('Push notification permission denied');
        return false;
      }
    } catch (error) {
      logger.error('Error requesting notification permission', { error });
      toast.error('Erro ao solicitar permissão para notificações');
      return false;
    }
  }, [isSupported]);

  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sb2_notification_settings', JSON.stringify(newSettings));
    logger.info('Notification settings saved', { settings: newSettings });
  }, []);

  const scheduleNotification = useCallback((notification: Omit<ScheduledNotification, 'id'>) => {
    if (permission !== 'granted') {
      logger.warn('Cannot schedule notification: permission not granted');
      return;
    }

    const id = crypto.randomUUID();
    const scheduledNotification = { ...notification, id };

    const timeUntilNotification = notification.scheduledFor.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: notification.type,
          requireInteraction: true
        });
        
        logger.info('Notification shown', { notification });
      }, timeUntilNotification);

      setScheduledNotifications(prev => [...prev, scheduledNotification]);
      logger.info('Notification scheduled', { notification: scheduledNotification });
    }
  }, [permission]);

  const startNotificationSchedule = useCallback(async () => {
    if (permission !== 'granted') {
      logger.warn('Cannot start notification schedule: permission not granted');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Schedule weight reminder (daily at 8 AM)
    if (settings.weightReminder) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);

      scheduleNotification({
        title: 'SB2coach.ai - Hora de se pesar! ⚖️',
        body: 'Registre seu peso para acompanhar seu progresso diário',
        scheduledFor: tomorrow,
        type: 'weight'
      });
    }

    // Schedule supplement reminders
    if (settings.supplementReminder) {
      const savedTimes = localStorage.getItem('sb2_supplement_times');
      const times = savedTimes ? JSON.parse(savedTimes) : { morning: '08:00', evening: '20:00' };

      [times.morning, times.evening].forEach((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const nextReminder = new Date();
        nextReminder.setHours(hours, minutes, 0, 0);
        
        if (nextReminder.getTime() <= Date.now()) {
          nextReminder.setDate(nextReminder.getDate() + 1);
        }

        scheduleNotification({
          title: 'SB2 TURBO - Hora do suplemento! 💊',
          body: `Lembrete: Tomar ${index === 0 ? 'manhã' : 'noite'} - 1 cápsula`,
          scheduledFor: nextReminder,
          type: 'supplement'
        });
      });
    }

    // Schedule streak reminder (8 PM daily)
    if (settings.streakReminder) {
      const tonight = new Date();
      tonight.setHours(20, 0, 0, 0);
      if (tonight.getTime() <= Date.now()) {
        tonight.setDate(tonight.getDate() + 1);
      }

      scheduleNotification({
        title: 'SB2coach.ai - Mantenha sua sequência! 🔥',
        body: 'Não esqueça de completar suas atividades diárias',
        scheduledFor: tonight,
        type: 'streak'
      });
    }

    logger.info('Notification schedule started');
  }, [permission, settings, scheduleNotification]);

  const clearScheduledNotifications = useCallback(() => {
    setScheduledNotifications([]);
    logger.info('Scheduled notifications cleared');
  }, []);

  return {
    permission,
    settings,
    isSupported,
    scheduledNotifications,
    requestPermission,
    saveSettings,
    scheduleNotification,
    startNotificationSchedule,
    clearScheduledNotifications
  };
};
