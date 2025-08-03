
import { debounce } from './performanceUtils';

class NavigationOptimizer {
  private transitionQueue: Array<() => void> = [];
  private isTransitioning = false;

  // Debounced navigation para evitar mudanças rápidas
  private debouncedNavigate = debounce((callback: () => void) => {
    this.executeTransition(callback);
  }, 100);

  private executeTransition(callback: () => void) {
    if (this.isTransitioning) {
      this.transitionQueue.push(callback);
      return;
    }

    this.isTransitioning = true;
    
    requestAnimationFrame(() => {
      try {
        callback();
      } finally {
        this.isTransitioning = false;
        
        // Processar próximo item da fila
        if (this.transitionQueue.length > 0) {
          const nextCallback = this.transitionQueue.shift();
          if (nextCallback) {
            this.executeTransition(nextCallback);
          }
        }
      }
    });
  }

  navigate(callback: () => void) {
    this.debouncedNavigate(callback);
  }

  // Preload de recursos críticos
  preloadCriticalResources() {
    const criticalComponents = [
      '@/components/DailyHabit',
      '@/components/AIChat',
      '@/features/calorie-counter/components/CalorieCounterTab'
    ];

    criticalComponents.forEach(component => {
      // Preload durante idle time
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import(component).catch(() => {
            // Silenciosamente ignorar falhas de preload
          });
        });
      }
    });
  }

  // Limpar recursos não utilizados
  cleanup() {
    this.transitionQueue = [];
    this.isTransitioning = false;
  }
}

export const navigationOptimizer = new NavigationOptimizer();

// Hook otimizado para navegação
export const useOptimizedNavigation = () => {
  return {
    navigate: (callback: () => void) => navigationOptimizer.navigate(callback),
    preloadCritical: () => navigationOptimizer.preloadCriticalResources(),
    cleanup: () => navigationOptimizer.cleanup()
  };
};
