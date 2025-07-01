
import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Só registrar SW em produção
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      setIsSupported(true);
      
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        })
        .then(registration => {
          logger.info('Service Worker registered successfully', { 
            scope: registration.scope 
          });
          setIsRegistered(true);

          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Verificar por atualizações a cada 30 minutos
          setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);
        })
        .catch(error => {
          // Log error silenciosamente, sem alertar o usuário
          if (process.env.NODE_ENV === 'development') {
            logger.error('Service Worker registration failed', { error });
          }
        });

      // Limpar service workers antigos
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          if (registration.scope !== window.location.origin + '/') {
            registration.unregister();
          }
        });
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return {
    isSupported,
    isRegistered,
    updateAvailable,
    updateServiceWorker
  };
};
