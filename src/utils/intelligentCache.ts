
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  size: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  memoryUsage: number;
  hitRate: number;
}

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  preload?: boolean;
}

class IntelligentCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutos
  private readonly maxSize: number;
  private readonly maxMemoryMB: number;
  private cleanupInterval: NodeJS.Timeout;
  private preloadQueue: string[] = [];
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    memoryUsage: 0,
    hitRate: 0
  };

  // TTL inteligente baseado no tipo de dados
  private readonly intelligentTTLs = {
    'user:': 10 * 60 * 1000,      // 10 minutos - dados do usuário
    'api:auth': 30 * 60 * 1000,   // 30 minutos - dados de autenticação
    'api:static': 60 * 60 * 1000, // 1 hora - dados estáticos
    'api:dynamic': 2 * 60 * 1000, // 2 minutos - dados dinâmicos
    'ui:': 15 * 60 * 1000,        // 15 minutos - estado da UI
    'temp:': 30 * 1000,           // 30 segundos - dados temporários
  };

  constructor(maxSize = 1500, maxMemoryMB = 100) {
    this.maxSize = maxSize;
    this.maxMemoryMB = maxMemoryMB;
    
    // Cleanup mais inteligente a cada 90 segundos
    this.cleanupInterval = setInterval(() => {
      this.intelligentCleanup();
    }, 90 * 1000);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.persistCriticalData();
      });
      this.loadPersistedData();
    }
  }

  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 0;
    }
  }

  private calculateMemoryUsage(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size + 300; // overhead estimado
    }
    return totalSize / (1024 * 1024); // MB
  }

  private getIntelligentTTL(key: string, customTTL?: number): number {
    if (customTTL) return customTTL;
    
    for (const [prefix, ttl] of Object.entries(this.intelligentTTLs)) {
      if (key.startsWith(prefix)) {
        return ttl;
      }
    }
    
    return this.defaultTTL;
  }

  private shouldEvict(): boolean {
    const memoryUsage = this.calculateMemoryUsage();
    return this.cache.size >= this.maxSize || memoryUsage >= this.maxMemoryMB;
  }

  private intelligentEviction(): void {
    if (this.cache.size === 0) return;

    // Algoritmo de evição inteligente baseado em prioridade, uso e idade
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => {
      const age = Date.now() - entry.timestamp;
      const lastAccessAge = Date.now() - entry.lastAccessed;
      
      // Score baixo = maior chance de ser removido
      let score = 0;
      
      // Prioridade (peso 40%)
      const priorityWeights = { low: 0, medium: 25, high: 50, critical: 100 };
      score += priorityWeights[entry.priority] * 0.4;
      
      // Frequência de acesso (peso 30%)
      score += Math.min(entry.accessCount, 20) * 1.5;
      
      // Idade do último acesso (peso 20%)
      score += Math.max(0, 100 - (lastAccessAge / (60 * 1000))) * 0.2;
      
      // TTL restante (peso 10%)
      const ttlRemaining = Math.max(0, entry.ttl - age);
      score += (ttlRemaining / entry.ttl) * 10;
      
      return { key, score, entry };
    });

    // Ordenar por score (menor primeiro) e remover os piores
    entries.sort((a, b) => a.score - b.score);
    
    const toRemove = Math.ceil(this.cache.size * 0.1); // Remove 10%
    for (let i = 0; i < toRemove && entries[i]; i++) {
      this.cache.delete(entries[i].key);
      this.stats.evictions++;
    }
  }

  private intelligentCleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Remover entradas expiradas
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    // Eviction se necessário
    while (this.shouldEvict()) {
      this.intelligentEviction();
    }
    
    this.updateStats();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }
    
    const now = Date.now();
    
    // Verificar TTL
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }
    
    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;
    this.updateStats();
    
    return entry.data;
  }

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const now = Date.now();
    const ttl = this.getIntelligentTTL(key, options.ttl);
    const size = this.calculateSize(data);
    const tags = options.tags || [];
    const priority = options.priority || 'medium';

    // Auto-eviction se necessário
    while (this.shouldEvict()) {
      this.intelligentEviction();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now,
      tags,
      priority,
      size
    };

    this.cache.set(key, entry);
    
    // Preload se solicitado
    if (options.preload) {
      this.preloadQueue.push(key);
    }
    
    this.updateStats();
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  // Preload inteligente
  preload<T>(key: string, dataLoader: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const existing = this.get<T>(key);
    if (existing !== null) {
      return Promise.resolve(existing);
    }

    return dataLoader().then(data => {
      this.set(key, data, { ...options, priority: 'low' });
      return data;
    });
  }

  // Invalidação por tags otimizada
  invalidateByTag(tag: string): number {
    let invalidated = 0;
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      invalidated++;
    });
    
    this.updateStats();
    return invalidated;
  }

  // Warm-up de cache com dados críticos
  warmUp(entries: Array<{ key: string; data: any; options?: CacheOptions }>): void {
    entries.forEach(({ key, data, options }) => {
      this.set(key, data, { ...options, priority: 'high' });
    });
  }

  // Persistir apenas dados críticos
  private persistCriticalData(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const criticalEntries: Array<[string, any]> = [];
      
      for (const [key, entry] of this.cache.entries()) {
        if (entry.priority === 'critical' || entry.tags.includes('persist')) {
          criticalEntries.push([key, entry]);
        }
      }

      if (criticalEntries.length > 0) {
        localStorage.setItem('intelligent_cache_v2', JSON.stringify(criticalEntries));
      }
    } catch (error) {
      console.warn('Failed to persist critical cache data:', error);
    }
  }

  private loadPersistedData(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('intelligent_cache_v2');
      if (stored) {
        const entries: Array<[string, CacheEntry<any>]> = JSON.parse(stored);
        const now = Date.now();

        entries.forEach(([key, entry]) => {
          // Verificar se ainda é válido (com margem de 10%)
          const ttlWithMargin = entry.ttl * 1.1;
          if (now - entry.timestamp < ttlWithMargin) {
            this.cache.set(key, entry);
          }
        });

        this.updateStats();
      }
    } catch (error) {
      console.warn('Failed to load persisted cache:', error);
      localStorage.removeItem('intelligent_cache_v2');
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.memoryUsage = this.calculateMemoryUsage();
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getHealthReport(): any {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      priority: entry.priority,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      accessCount: entry.accessCount,
      size: entry.size,
      tags: entry.tags
    }));

    return {
      stats: this.getStats(),
      topEntries: entries
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, 10),
      memoryByPriority: {
        critical: entries.filter(e => e.priority === 'critical').length,
        high: entries.filter(e => e.priority === 'high').length,
        medium: entries.filter(e => e.priority === 'medium').length,
        low: entries.filter(e => e.priority === 'low').length,
      }
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.persistCriticalData();
    this.cache.clear();
  }
}

// Instância singleton
export const intelligentCache = new IntelligentCacheManager();

// Hook otimizado para React
export const useIntelligentCache = () => {
  return {
    get: <T>(key: string) => intelligentCache.get<T>(key),
    set: <T>(key: string, data: T, options?: CacheOptions) => 
      intelligentCache.set(key, data, options),
    delete: (key: string) => intelligentCache.delete(key),
    invalidateByTag: (tag: string) => intelligentCache.invalidateByTag(tag),
    preload: <T>(key: string, loader: () => Promise<T>, options?: CacheOptions) => 
      intelligentCache.preload(key, loader, options),
    warmUp: (entries: Array<{ key: string; data: any; options?: CacheOptions }>) => 
      intelligentCache.warmUp(entries),
    getStats: () => intelligentCache.getStats(),
    getHealthReport: () => intelligentCache.getHealthReport()
  };
};
