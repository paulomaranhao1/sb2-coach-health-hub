
import { debounce, throttle } from './performanceUtils';

// Performance monitoring - desabilitado para evitar problemas
export const performanceMonitor = {
  markStart: (name: string) => {
    // Desabilitado
  },
  
  markEnd: (name: string) => {
    // Desabilitado
  }
};

// Optimized scroll handler
export const createOptimizedScrollHandler = (callback: () => void) => {
  return throttle(callback, 16);
};

// Optimized search handler
export const createOptimizedSearchHandler = (callback: (query: string) => void) => {
  return debounce(callback, 300);
};

// Memory usage monitor - desabilitado
export const memoryMonitor = {
  log: () => {
    // Desabilitado
  }
};

// Resource prefetching - removido para evitar problemas
export const prefetchResources = (urls: string[]) => {
  // Desabilitado para evitar console warnings
};

// Critical resource preloading - removido
export const preloadCriticalResources = () => {
  // Desabilitado para evitar problemas de carregamento
};
