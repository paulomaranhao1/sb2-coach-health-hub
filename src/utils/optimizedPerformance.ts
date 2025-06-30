
import { debounce, throttle } from './performanceUtils';

// Performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  },
  
  markEnd: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measurement = performance.getEntriesByName(name, 'measure')[0];
      if (measurement) {
        console.log(`⚡ ${name}: ${measurement.duration.toFixed(2)}ms`);
      }
    }
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

// Memory usage monitor
export const memoryMonitor = {
  log: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('🧠 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
      });
    }
  }
};

// Resource prefetching
export const prefetchResources = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Critical resource preloading
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/favicon.ico',
    // Add other critical resources
  ];
  
  criticalResources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'image';
    document.head.appendChild(link);
  });
};
