
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Home, Copy } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level: 'page' | 'section' | 'component';
  name: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDebugInfo?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId: string;
}

class GlobalErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private errorReportingEndpoint = '/api/errors'; // Future endpoint for error reporting

  public state: State = {
    hasError: false,
    retryCount: 0,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level, name, onError } = this.props;
    
    // Log error with context
    logger.error(`Error Boundary Caught Error in ${level}: ${name}`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      retryCount: this.state.retryCount,
      props: this.props
    });

    // Store error info in state
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Report error to external service (future implementation)
    this.reportError(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Future: Send error to monitoring service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId,
        level: this.props.level,
        component: this.props.name
      };

      // For now, just log to console in development
      if (import.meta.env.DEV) {
        console.group(`🔴 Error Report - ${this.state.errorId}`);
        console.error('Error Report:', errorReport);
        console.groupEnd();
      }
    } catch (reportingError) {
      logger.error('Failed to report error', { reportingError });
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      logger.info(`Retrying ${this.props.name} (attempt ${retryCount + 1}/${this.maxRetries})`);
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1 
      });
    } else {
      logger.warn(`Max retries reached for ${this.props.name}`);
    }
  };

  private handleReload = () => {
    logger.info(`Reloading page due to error in ${this.props.name}`);
    window.location.reload();
  };

  private handleGoHome = () => {
    logger.info(`Navigating to home due to error in ${this.props.name}`);
    window.location.href = '/';
  };

  private copyErrorDetails = async () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      component: this.props.name,
      level: this.props.level,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      logger.info('Error details copied to clipboard');
    } catch (err) {
      logger.error('Failed to copy error details', { err });
    }
  };

  private getErrorSeverity = (): 'low' | 'medium' | 'high' => {
    const { level } = this.props;
    switch (level) {
      case 'page': return 'high';
      case 'section': return 'medium';
      case 'component': return 'low';
      default: return 'medium';
    }
  };

  private getErrorTheme = () => {
    const severity = this.getErrorSeverity();
    switch (severity) {
      case 'high':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50',
          text: 'text-red-700',
          button: 'border-red-300 text-red-700 hover:bg-red-100'
        };
      case 'medium':
        return {
          border: 'border-orange-400',
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          button: 'border-orange-300 text-orange-700 hover:bg-orange-100'
        };
      case 'low':
        return {
          border: 'border-yellow-400',
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          button: 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'
        };
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const theme = this.getErrorTheme();
      const severity = this.getErrorSeverity();
      const canRetry = this.state.retryCount < this.maxRetries;
      const showDebugInfo = this.props.showDebugInfo ?? import.meta.env.DEV;

      return (
        <Card className={`${theme.border} ${theme.bg} shadow-lg`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${theme.text}`}>
              <AlertTriangle className="w-5 h-5" />
              Erro {severity === 'high' ? 'Crítico' : severity === 'medium' ? 'Moderado' : 'Leve'} - {this.props.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className={theme.text}>
                {severity === 'high' 
                  ? 'Ocorreu um erro crítico que impediu o carregamento desta página.'
                  : severity === 'medium'
                  ? 'Ocorreu um erro que afetou esta seção.'
                  : 'Ocorreu um erro menor neste componente.'
                }
              </p>
              
              {this.state.retryCount > 0 && (
                <p className="text-sm text-gray-600">
                  Tentativas de recuperação: {this.state.retryCount}/{this.maxRetries}
                </p>
              )}
            </div>

            {showDebugInfo && this.state.error && (
              <details className="text-sm space-y-2">
                <summary className={`cursor-pointer font-medium ${theme.text}`}>
                  Detalhes Técnicos (ID: {this.state.errorId})
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-md font-mono text-xs overflow-auto max-h-32">
                  <div><strong>Erro:</strong> {this.state.error.message}</div>
                  {this.state.error.stack && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-wrap gap-2">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className={theme.button}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}

              {severity === 'high' && (
                <>
                  <Button 
                    onClick={this.handleReload}
                    variant="outline"
                    size="sm"
                    className={theme.button}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recarregar Página
                  </Button>
                  
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline"
                    size="sm"
                    className={theme.button}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Ir para Início
                  </Button>
                </>
              )}

              {showDebugInfo && (
                <Button 
                  onClick={this.copyErrorDetails}
                  variant="outline"
                  size="sm"
                  className={theme.button}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Detalhes
                </Button>
              )}
            </div>

            {!canRetry && severity !== 'high' && (
              <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                <Bug className="w-4 h-4 inline mr-2" />
                Se o problema persistir, tente recarregar a página.
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
