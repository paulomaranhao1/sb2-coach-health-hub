
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
type LogContext = Record<string, any>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: LogContext;
  component?: string;
  userId?: string;
  sessionId: string;
  environment: string;
  buildVersion: string;
}

interface LoggerConfig {
  maxLogs: number;
  enableConsole: boolean;
  enablePersistence: boolean;
  enableTelemetry: boolean;
  minLevel: LogLevel;
  batchSize: number;
  flushInterval: number;
}

class ProfessionalLogger {
  private logs: LogEntry[] = [];
  private config: LoggerConfig;
  private sessionId: string;
  private userId?: string;
  private environment: string;
  private buildVersion: string;
  private batchQueue: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private static instance: ProfessionalLogger;

  private readonly levelPriority = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    critical: 4
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.environment = import.meta.env.MODE || 'development';
    this.buildVersion = import.meta.env.VITE_BUILD_VERSION || '1.0.0';
    
    this.config = {
      maxLogs: 1000,
      enableConsole: this.environment === 'development',
      enablePersistence: true,
      enableTelemetry: this.environment === 'production',
      minLevel: this.environment === 'development' ? 'debug' : 'info',
      batchSize: 50,
      flushInterval: 30000,
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.setupErrorHandlers();
    this.loadPersistedLogs();
    this.startBatchFlush();
  }

  public static getInstance(config?: Partial<LoggerConfig>): ProfessionalLogger {
    if (!ProfessionalLogger.instance) {
      ProfessionalLogger.instance = new ProfessionalLogger(config);
    }
    return ProfessionalLogger.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorHandlers(): void {
    window.addEventListener('error', (event) => {
      this.critical('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.critical('Unhandled Promise Rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.config.minLevel];
  }

  private createLogEntry(level: LogLevel, message: string, context?: LogContext, component?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      component,
      userId: this.userId,
      sessionId: this.sessionId,
      environment: this.environment,
      buildVersion: this.buildVersion
    };
  }

  private persistLog(entry: LogEntry): void {
    if (!this.config.enablePersistence) return;

    try {
      this.logs.push(entry);
      
      if (this.logs.length > this.config.maxLogs) {
        this.logs = this.logs.slice(-this.config.maxLogs);
      }

      if (typeof localStorage !== 'undefined') {
        const recentLogs = this.logs.slice(-200);
        localStorage.setItem('app_logs_v2', JSON.stringify(recentLogs));
      }
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  private loadPersistedLogs(): void {
    if (!this.config.enablePersistence || typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('app_logs_v2');
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load persisted logs:', error);
      localStorage.removeItem('app_logs_v2');
    }
  }

  private startBatchFlush(): void {
    if (!this.config.enableTelemetry) return;

    this.flushTimer = setInterval(() => {
      this.flushBatch();
    }, this.config.flushInterval);
  }

  private async flushBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const batch = [...this.batchQueue];
    this.batchQueue = [];

    try {
      // Future: Send to telemetry service
      if (this.environment === 'development') {
        console.group('📊 Log Batch Flush');
        console.table(batch.map(log => ({
          level: log.level,
          message: log.message,
          component: log.component,
          timestamp: log.timestamp.toISOString()
        })));
        console.groupEnd();
      }
    } catch (error) {
      console.error('Failed to flush log batch:', error);
      // Re-queue failed logs
      this.batchQueue.unshift(...batch);
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, component?: string): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, component);
    this.persistLog(entry);

    if (this.config.enableTelemetry) {
      this.batchQueue.push(entry);
      if (this.batchQueue.length >= this.config.batchSize) {
        this.flushBatch();
      }
    }

    if (this.config.enableConsole) {
      const logMethod = console[level] || console.log;
      const timestamp = entry.timestamp.toISOString();
      const componentTag = component ? `[${component}]` : '';
      const contextStr = context ? JSON.stringify(context) : '';
      
      logMethod(
        `🔥 ${timestamp} ${level.toUpperCase()} ${componentTag} ${message} ${contextStr}`.trim()
      );
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext, component?: string): void {
    this.log('debug', message, context, component);
  }

  info(message: string, context?: LogContext, component?: string): void {
    this.log('info', message, context, component);
  }

  warn(message: string, context?: LogContext, component?: string): void {
    this.log('warn', message, context, component);
  }

  error(message: string, context?: LogContext, component?: string): void {
    this.log('error', message, context, component);
  }

  critical(message: string, context?: LogContext, component?: string): void {
    this.log('critical', message, context, component);
  }

  // Utility methods
  setUserId(userId: string): void {
    this.userId = userId;
    this.info('User session started', { userId });
  }

  clearUserId(): void {
    this.info('User session ended', { userId: this.userId });
    this.userId = undefined;
  }

  // Performance tracking
  startPerformanceTimer(label: string, component?: string): () => void {
    const startTime = performance.now();
    this.debug(`Performance timer started: ${label}`, { startTime }, component);
    
    return () => {
      const duration = performance.now() - startTime;
      this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` }, component);
    };
  }

  // Health check
  getHealthStatus(): any {
    return {
      logsCount: this.logs.length,
      batchQueueSize: this.batchQueue.length,
      sessionId: this.sessionId,
      environment: this.environment,
      buildVersion: this.buildVersion,
      config: this.config
    };
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushBatch();
  }
}

// Create singleton instance
export const professionalLogger = ProfessionalLogger.getInstance();

// Enhanced hook for React components
export const useAdvancedLogger = (componentName: string) => {
  const logger = {
    debug: (message: string, context?: LogContext) => 
      professionalLogger.debug(message, context, componentName),
    info: (message: string, context?: LogContext) => 
      professionalLogger.info(message, context, componentName),
    warn: (message: string, context?: LogContext) => 
      professionalLogger.warn(message, context, componentName),
    error: (message: string, context?: LogContext) => 
      professionalLogger.error(message, context, componentName),
    critical: (message: string, context?: LogContext) => 
      professionalLogger.critical(message, context, componentName),
    startTimer: (label: string) => 
      professionalLogger.startPerformanceTimer(label, componentName)
  };

  return logger;
};
