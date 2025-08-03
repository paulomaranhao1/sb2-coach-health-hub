
import { useState, useCallback, useRef } from 'react';
import { useIntelligentCache } from '@/utils/intelligentCache';

interface NavigationCacheHook {
  getCachedComponent: (tabName: string) => React.ComponentType<any> | null;
  setCachedComponent: (tabName: string, component: React.ComponentType<any>) => void;
  preloadComponent: (tabName: string) => Promise<void>;
  clearCache: () => void;
}

const componentLoaders: Record<string, () => Promise<any>> = {
  'chat': () => import('@/components/AIChat'),
  'calorie-counter': () => import('@/features/calorie-counter/components/CalorieCounterTab'),
  'intermittent-fasting': () => import('@/features/fasting/components/IntermittentFasting'),
  'gamification': () => import('@/components/GamificationSystem'),
  'statistics': () => import('@/features/dashboard/components/DashboardOverview'),
  'profile': () => import('@/components/UserProfile'),
  'settings': () => import('@/components/AppSettings')
};

export const useNavigationCache = (): NavigationCacheHook => {
  const cache = useIntelligentCache();
  const preloadingRef = useRef<Set<string>>(new Set());

  const getCachedComponent = useCallback((tabName: string) => {
    return cache.get<React.ComponentType<any>>(`nav:component:${tabName}`);
  }, [cache]);

  const setCachedComponent = useCallback((tabName: string, component: React.ComponentType<any>) => {
    cache.set(`nav:component:${tabName}`, component, {
      ttl: 10 * 60 * 1000, // 10 minutos
      tags: ['navigation', 'components'],
      priority: 'high'
    });
  }, [cache]);

  const preloadComponent = useCallback(async (tabName: string) => {
    // Evitar preload duplicado
    if (preloadingRef.current.has(tabName)) return;
    
    // Verificar se já está em cache
    if (getCachedComponent(tabName)) return;
    
    const loader = componentLoaders[tabName];
    if (!loader) return;

    preloadingRef.current.add(tabName);

    try {
      const module = await loader();
      const Component = module.default;
      setCachedComponent(tabName, Component);
    } catch (error) {
      console.warn(`Failed to preload component ${tabName}:`, error);
    } finally {
      preloadingRef.current.delete(tabName);
    }
  }, [getCachedComponent, setCachedComponent]);

  const clearCache = useCallback(() => {
    cache.invalidateByTag('navigation');
    preloadingRef.current.clear();
  }, [cache]);

  return {
    getCachedComponent,
    setCachedComponent,
    preloadComponent,
    clearCache
  };
};
