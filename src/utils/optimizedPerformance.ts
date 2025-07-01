
import { debounce, throttle } from './performanceUtils';

// Simplified performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    // Simple console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} started`);
    }
  },
  
  markEnd: (name: string) => {
    // Simple console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} ended`);
    }
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

// Simplified memory monitoring
export const memoryMonitor = {
  log: () => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      console.log('Memory usage:', (performance as any).memory);
    }
  }
};

// Disabled resource prefetching to avoid console warnings
export const prefetchResources = (urls: string[]) => {
  // Disabled to prevent console warnings
};

// Disabled critical resource preloading
export const preloadCriticalResources = () => {
  // Disabled to prevent console warnings
};
