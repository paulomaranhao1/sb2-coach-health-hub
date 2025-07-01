
import { debounce, throttle } from './performanceUtils';

// Performance monitoring - completely disabled in production
export const performanceMonitor = {
  markStart: (name: string) => {
    // Disabled to reduce console noise
  },
  
  markEnd: (name: string) => {
    // Disabled to reduce console noise
  }
};

// Optimized scroll handler
export const createOptimizedScrollHandler = (callback: () => void) => {
  return throttle(callback, 16); // ~60fps
};

// Optimized search handler
export const createOptimizedSearchHandler = (callback: (query: string) => void) => {
  return debounce(callback, 300);
};

// Memory usage monitor - completely disabled
export const memoryMonitor = {
  log: () => {
    // Disabled to reduce console noise
  }
};

// Resource prefetching - apenas para recursos essenciais
export const prefetchResources = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Critical resource preloading - removido favicon para evitar warnings
export const preloadCriticalResources = () => {
  // Removido preload do favicon para evitar console warnings
  // O favicon será carregado naturalmente pelo navegador
};
