
import { useState } from 'react';
import { useNotificationService } from './useNotificationService';
import { logger } from '@/utils/logger';

export const usePushNotifications = () => {
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const { 
    requestPermission, 
    startNotificationSchedule, 
    clearScheduledNotifications 
  } = useNotificationService();

  const subscribe = async () => {
    setIsSubscriptionLoading(true);
    try {
      logger.info('Push notifications: Starting subscription process');
      const granted = await requestPermission();
      if (granted) {
        await startNotificationSchedule();
        logger.info('Push notifications: Successfully subscribed');
      }
    } catch (error) {
      logger.error('Erro ao subscrever notificações', { error });
      throw error;
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsSubscriptionLoading(true);
    try {
      logger.info('Push notifications: Starting unsubscribe process');
      clearScheduledNotifications();
      logger.info('Push notifications: Successfully unsubscribed');
    } catch (error) {
      logger.error('Erro ao desinscrever notificações', { error });
      throw error;
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  return {
    isSubscriptionLoading,
    subscribe,
    unsubscribe
  };
};
