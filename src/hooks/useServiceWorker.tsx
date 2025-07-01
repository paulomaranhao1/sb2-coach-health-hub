
import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
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
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        logger.info('Service Worker not enabled in development mode');
      }
    }
  }, []);

  return {
    isSupported,
    isRegistered
  };
};
