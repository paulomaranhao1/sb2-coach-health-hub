
import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          logger.info('Service Worker registered successfully', { 
            scope: registration.scope 
          });
          setIsRegistered(true);
        })
        .catch(error => {
          logger.error('Service Worker registration failed', { error });
        });
    } else {
      logger.warn('Service Worker not supported in this browser');
    }
  }, []);

  return {
    isSupported,
    isRegistered
  };
};
