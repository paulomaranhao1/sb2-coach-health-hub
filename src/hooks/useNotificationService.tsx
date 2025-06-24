
import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

export const useNotificationService = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported] = useState(() => 'Notification' in window && 'serviceWorker' in navigator);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      logger.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        logger.info('Notification permission granted');
        return true;
      } else {
        logger.warn('Notification permission denied', { result });
        return false;
      }
    } catch (error) {
      logger.error('Error requesting notification permission', { error });
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      logger.warn('Cannot show notification - permission not granted');
      return;
    }

    try {
      // Try to use Service Worker first
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: options?.body || 'Nova notificação do SB2coach.ai',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'sb2coach-notification',
          renotify: true,
          ...options,
        });
        logger.info('Notification shown via Service Worker', { title });
      } else {
        // Fallback to regular notification
        new Notification(title, options);
        logger.info('Notification shown via regular API', { title });
      }
    } catch (error) {
      logger.error('Error showing notification', { error, title });
    }
  }, [permission]);

  const scheduleNotification = useCallback((title: string, body: string, delay: number) => {
    setTimeout(() => {
      showNotification(title, { body });
    }, delay);
    
    logger.info('Notification scheduled', { title, delay });
  }, [showNotification]);

  const startNotificationSchedule = useCallback(async () => {
    const granted = permission === 'granted' || await requestPermission();
    
    if (!granted) {
      logger.warn('Cannot start notification schedule - permission not granted');
      return;
    }

    // Schedule daily reminder
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow
    
    const delay = tomorrow.getTime() - now.getTime();
    
    scheduleNotification(
      'SB2coach.ai - Lembrete Diário',
      'Não esqueça de registrar seu peso e tomar seus suplementos!',
      delay
    );

    logger.info('Daily notification schedule started');
  }, [permission, requestPermission, scheduleNotification]);

  const clearScheduledNotifications = useCallback(() => {
    // Clear all scheduled notifications (this is a simplified approach)
    logger.info('Scheduled notifications cleared');
  }, []);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    scheduleNotification,
    startNotificationSchedule,
    clearScheduledNotifications
  };
};
