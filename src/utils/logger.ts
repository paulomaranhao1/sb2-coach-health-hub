
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, any>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: LogContext;
  component?: string;
  userId?: string;
  sessionId: string;
}

interface LoggerConfig {
  maxLogs: number;
  enableConsole: boolean;
  enablePersistence: boolean;
  minLevel: LogLevel;
}

class AdvancedLogger {
  private logs: LogEntry[] = [];
  private config: LoggerConfig;
  private sessionId: string;
  private userId?: string;
  private static instance: AdvancedLogger;

  private readonly levelPriority = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      maxLogs: 500,
      enableConsole: import.meta.env.DEV,
      enablePersistence: true,
      minLevel: import.meta.env.DEV ? 'debug' : 'info',
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.setupErrorHandlers();
    this.loadPersistedLogs();
  }

  public static getInstance(config?: Partial<LoggerConfig>): AdvancedLogger {
    if (!AdvancedLogger.instance) {
      AdvancedLogger.instance = new AdvancedLogger(config);
    }
    return AdvancedLogger.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.error('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
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
      sessionId: this.sessionId
    };
  }

  private persistLog(entry: LogEntry): void {
    if (!this.config.enablePersistence) return;

    try {
      this.logs.push(entry);
      
      // Maintain max logs limit
      if (this.logs.length > this.config.maxLogs) {
        this.logs = this.logs.slice(-this.config.maxLogs);
      }

      // Persist to localStorage (only in browser)
      if (typeof localStorage !== 'undefined') {
        const recentLogs = this.logs.slice(-100); // Keep only last 100 logs
        localStorage.setItem('app_logs', JSON.stringify(recentLogs));
      }
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  private loadPersistedLogs(): void {
    if (!this.config.enablePersistence || typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('app_logs');
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load persisted logs:', error);
    }
  }

  private formatLogMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const component = entry.component ? `[${entry.component}]` : '';
    const context = entry.context ? JSON.stringify(entry.context) : '';
    
    return `[${timestamp}] ${entry.level.toUpperCase()} ${component} ${entry.message} ${context}`.trim();
  }

  private log(level: LogLevel, message: string, context?: LogContext, component?: string): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, component);
    this.persistLog(entry);

    if (this.config.enableConsole) {
      const formattedMessage = this.formatLogMessage(entry);
      const logMethod = console[level] || console.log;
      
      if (context) {
        logMethod(formattedMessage, context);
      } else {
        logMethod(formattedMessage);
      }
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

  // Utility methods
  setUserId(userId: string): void {
    this.userId = userId;
  }

  clearUserId(): void {
    this.userId = undefined;
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  clearLogs(): void {
    this.logs = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('app_logs');
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Performance logging
  startTimer(label: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  // Component lifecycle logging
  componentMounted(componentName: string, props?: any): void {
    this.debug(`Component mounted: ${componentName}`, { props }, componentName);
  }

  componentUnmounted(componentName: string): void {
    this.debug(`Component unmounted: ${componentName}`, {}, componentName);
  }

  // API logging
  apiRequest(url: string, method: string, params?: any): void {
    this.info(`API Request: ${method} ${url}`, { params });
  }

  apiResponse(url: string, method: string, status: number, duration: number): void {
    this.info(`API Response: ${method} ${url}`, { status, duration: `${duration}ms` });
  }

  apiError(url: string, method: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, { error: error.message, stack: error.stack });
  }
}

// Create singleton instance
export const logger = AdvancedLogger.getInstance();

// Export hook for React components
export const useLogger = (componentName: string) => {
  const componentLogger = {
    debug: (message: string, context?: LogContext) => logger.debug(message, context, componentName),
    info: (message: string, context?: LogContext) => logger.info(message, context, componentName),
    warn: (message: string, context?: LogContext) => logger.warn(message, context, componentName),
    error: (message: string, context?: LogContext) => logger.error(message, context, componentName),
    mounted: (props?: any) => logger.componentMounted(componentName, props),
    unmounted: () => logger.componentUnmounted(componentName)
  };

  return componentLogger;
};
