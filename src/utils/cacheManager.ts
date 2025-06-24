
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  tags: string[];
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  memoryUsage: number;
}

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

class AdvancedCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutos
  private readonly maxSize: number;
  private readonly maxMemoryMB: number;
  private cleanupInterval: NodeJS.Timeout;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    memoryUsage: 0
  };

  constructor(maxSize = 1000, maxMemoryMB = 50) {
    this.maxSize = maxSize;
    this.maxMemoryMB = maxMemoryMB;
    
    // Cleanup automático a cada 2 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 2 * 60 * 1000);

    // Cleanup quando a página vai ser fechada
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.persist();
      });

      // Carregar cache persistido
      this.loadPersisted();
    }
  }

  private calculateMemoryUsage(): number {
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      // Estimativa grosseira do tamanho em bytes
      const keySize = new Blob([key]).size;
      const dataSize = new Blob([JSON.stringify(entry.data)]).size;
      totalSize += keySize + dataSize + 200; // overhead estimado
    }
    return totalSize / (1024 * 1024); // MB
  }

  private shouldEvict(): boolean {
    const memoryUsage = this.calculateMemoryUsage();
    return this.cache.size >= this.maxSize || memoryUsage >= this.maxMemoryMB;
  }

  private evictLRU(): void {
    if (this.cache.size === 0) return;

    // Encontrar entrada menos recentemente usada
    let lruKey = '';
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  private evictByPriority(): void {
    // Remover entradas de baixa prioridade primeiro
    const lowPriorityKeys: string[] = [];
    const mediumPriorityKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      const tags = entry.tags || [];
      if (tags.includes('priority:low')) {
        lowPriorityKeys.push(key);
      } else if (tags.includes('priority:medium')) {
        mediumPriorityKeys.push(key);
      }
    }

    // Remover baixa prioridade primeiro
    if (lowPriorityKeys.length > 0) {
      const keyToRemove = lowPriorityKeys[0];
      this.cache.delete(keyToRemove);
      this.stats.evictions++;
    } else if (mediumPriorityKeys.length > 0) {
      const keyToRemove = mediumPriorityKeys[0];
      this.cache.delete(keyToRemove);
      this.stats.evictions++;
    } else {
      // Fallback para LRU
      this.evictLRU();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    const now = Date.now();
    
    // Verificar TTL
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;
    
    return entry.data;
  }

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const now = Date.now();
    const ttl = options.ttl || this.defaultTTL;
    const tags = options.tags || [];
    
    // Adicionar tag de prioridade se especificada
    if (options.priority) {
      tags.push(`priority:${options.priority}`);
    }

    // Verificar se precisa fazer eviction
    while (this.shouldEvict()) {
      this.evictByPriority();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now,
      tags
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.updateStats();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Invalidar por tags
  invalidateByTag(tag: string): number {
    let invalidated = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    this.updateStats();
    return invalidated;
  }

  // Invalidar por padrão de chave
  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    this.updateStats();
    return invalidated;
  }

  // Prefetch - pré-carregar dados
  prefetch<T>(key: string, dataLoader: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    // Se já existe no cache e não expirou, retorna
    const existing = this.get<T>(key);
    if (existing !== null) {
      return Promise.resolve(existing);
    }

    // Senão, carrega e armazena
    return dataLoader().then(data => {
      this.set(key, data, { ...options, priority: 'low' }); // Prefetch com baixa prioridade
      return data;
    });
  }

  // Limpeza automática de entradas expiradas
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      this.updateStats();
    }
  }

  // Persistence para localStorage
  private persist(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const persistableEntries: Array<[string, any]> = [];
      
      for (const [key, entry] of this.cache.entries()) {
        // Só persistir entradas com tag 'persist'
        if (entry.tags.includes('persist')) {
          persistableEntries.push([key, entry]);
        }
      }

      if (persistableEntries.length > 0) {
        localStorage.setItem('advanced_cache', JSON.stringify(persistableEntries));
      }
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
  }

  private loadPersisted(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('advanced_cache');
      if (stored) {
        const entries: Array<[string, CacheEntry<any>]> = JSON.parse(stored);
        const now = Date.now();

        entries.forEach(([key, entry]) => {
          // Verificar se ainda é válido
          if (now - entry.timestamp < entry.ttl) {
            this.cache.set(key, entry);
          }
        });

        this.updateStats();
      }
    } catch (error) {
      console.warn('Failed to load persisted cache:', error);
      // Limpar cache corrompido
      localStorage.removeItem('advanced_cache');
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.memoryUsage = this.calculateMemoryUsage();
  }

  // Estatísticas e métricas
  getStats(): CacheStats {
    return { ...this.stats };
  }

  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  // Relatório detalhado do cache
  getReport(): any {
    const entries: any[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        tags: entry.tags,
        size: JSON.stringify(entry.data).length
      });
    }

    return {
      stats: this.getStats(),
      hitRate: this.getHitRate(),
      entries: entries.sort((a, b) => b.accessCount - a.accessCount)
    };
  }

  // Destruir o cache e limpar recursos
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Instância singleton
export const cacheManager = new AdvancedCacheManager();

// Hook para uso em componentes React
export const useCache = () => {
  return {
    get: <T>(key: string) => cacheManager.get<T>(key),
    set: <T>(key: string, data: T, options?: CacheOptions) => cacheManager.set(key, data, options),
    delete: (key: string) => cacheManager.delete(key),
    clear: () => cacheManager.clear(),
    has: (key: string) => cacheManager.has(key),
    invalidateByTag: (tag: string) => cacheManager.invalidateByTag(tag),
    invalidateByPattern: (pattern: RegExp) => cacheManager.invalidateByPattern(pattern),
    prefetch: <T>(key: string, loader: () => Promise<T>, options?: CacheOptions) => 
      cacheManager.prefetch(key, loader, options),
    getStats: () => cacheManager.getStats(),
    getHitRate: () => cacheManager.getHitRate()
  };
};

// Cache específico para API
export const apiCache = {
  get: <T>(endpoint: string): T | null => cacheManager.get(`api:${endpoint}`),
  set: <T>(endpoint: string, data: T, ttl = 5 * 60 * 1000) => 
    cacheManager.set(`api:${endpoint}`, data, { ttl, tags: ['api', 'persist'] }),
  invalidate: (endpoint: string) => cacheManager.delete(`api:${endpoint}`),
  invalidateAll: () => cacheManager.invalidateByTag('api')
};
