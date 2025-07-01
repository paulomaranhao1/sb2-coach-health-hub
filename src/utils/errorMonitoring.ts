
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  critical: boolean;
}

class ErrorMonitoring {
  private errors: ErrorReport[] = [];
  private maxErrors = 50;

  constructor() {
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling() {
    // Capturar erros JavaScript críticos
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        critical: this.isCriticalError(event.message)
      });
    });

    // Capturar promises rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        critical: this.isCriticalError(String(event.reason))
      });
    });
  }

  private isCriticalError(message: string): boolean {
    const criticalPatterns = [
      'TypeError',
      'ReferenceError',
      'SyntaxError',
      'RangeError',
      'Cannot read prop',
      'undefined is not a function',
      'null is not an object'
    ];

    const nonCriticalPatterns = [
      'facebook',
      'firebase',
      'google-analytics',
      'ambient-light-sensor',
      'battery',
      'vr',
      'xr-spatial-tracking',
      'sandbox',
      'Mixed Content',
      'blocked:csp'
    ];

    const messageLower = message.toLowerCase();

    // Se contém padrões não-críticos, não é crítico
    if (nonCriticalPatterns.some(pattern => messageLower.includes(pattern))) {
      return false;
    }

    // Se contém padrões críticos, é crítico
    return criticalPatterns.some(pattern => messageLower.includes(pattern.toLowerCase()));
  }

  private reportError(error: ErrorReport) {
    // Só reportar erros críticos
    if (!error.critical) {
      return;
    }

    this.errors.push(error);

    // Manter apenas os últimos erros
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Critical Error:', error);
    }
  }

  getCriticalErrors(): ErrorReport[] {
    return this.errors.filter(error => error.critical);
  }

  getErrorSummary(): { total: number; critical: number; recent: number } {
    const now = Date.now();
    const recent = this.errors.filter(error => now - error.timestamp < 300000); // últimos 5 min

    return {
      total: this.errors.length,
      critical: this.errors.filter(error => error.critical).length,
      recent: recent.length
    };
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorMonitor = new ErrorMonitoring();

// Hook para usar o monitor de erros
export const useErrorMonitoring = () => {
  return {
    getCriticalErrors: () => errorMonitor.getCriticalErrors(),
    getErrorSummary: () => errorMonitor.getErrorSummary(),
    clearErrors: () => errorMonitor.clearErrors()
  };
};
