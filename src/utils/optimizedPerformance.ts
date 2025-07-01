
import { debounce, throttle } from './performanceUtils';

// Monitor de performance simplificado e otimizado
export const performanceMonitor = {
  markStart: (name: string) => {
    if (process.env.NODE_ENV === 'development' && 'performance' in window) {
      try {
        performance.mark(`${name}-start`);
      } catch (error) {
        // Silenciosamente ignorar se performance.mark não estiver disponível
      }
    }
  },
  
  markEnd: (name: string) => {
    if (process.env.NODE_ENV === 'development' && 'performance' in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measures = performance.getEntriesByName(name);
        if (measures.length > 0) {
          const measure = measures[measures.length - 1];
          console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        // Silenciosamente ignorar erros de performance
      }
    }
  }
};

// Handlers otimizados
export const createOptimizedScrollHandler = (callback: () => void) => {
  return throttle(callback, 16); // 60fps
};

export const createOptimizedSearchHandler = (callback: (query: string) => void) => {
  return debounce(callback, 300);
};

export const createOptimizedResizeHandler = (callback: () => void) => {
  return throttle(callback, 100);
};

// Monitor de memória seguro
export const memoryMonitor = {
  log: () => {
    if (process.env.NODE_ENV === 'development') {
      try {
        if ('memory' in performance && (performance as any).memory) {
          const memory = (performance as any).memory;
          console.log('🧠 Memory usage:', {
            used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
            total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
            limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
          });
        }
      } catch (error) {
        // Silenciosamente ignorar se não estiver disponível
      }
    }
  },

  getUsage: () => {
    try {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        return {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
      }
    } catch (error) {
      // Silenciosamente retornar null se não estiver disponível
    }
    return null;
  }
};

// Sistema de cache inteligente
export class IntelligentCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 300000) { // 5 min default
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiry = ttl || this.defaultTTL;

    // Limpar cache expirado
    this.cleanup();

    // Remover item mais antigo se necessário
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: expiry
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }
}

// Detector de recursos críticos
export const resourceMonitor = {
  checkCriticalResources: async () => {
    const criticalResources = [
      '/src/main.tsx',
      '/src/App.tsx',
      '/src/index.css'
    ];

    const results = await Promise.allSettled(
      criticalResources.map(resource => 
        fetch(resource, { method: 'HEAD' })
      )
    );

    return results.every(result => result.status === 'fulfilled');
  },

  preloadCriticalResources: () => {
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/src/index.css';
    
    try {
      document.head.appendChild(criticalCSS);
    } catch (error) {
      // Silenciosamente ignorar se não conseguir fazer preload
    }
  }
};

// Export da instância de cache global
export const globalCache = new IntelligentCache(50, 600000); // 10 min TTL
