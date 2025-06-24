
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Home, Copy, Send } from 'lucide-react';
import { professionalLogger } from '@/utils/advancedLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level: 'page' | 'section' | 'component';
  name: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId: string;
  isReporting: boolean;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = this.props.maxRetries || 3;

  public state: State = {
    hasError: false,
    retryCount: 0,
    errorId: '',
    isReporting: false
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
    
    // Log with professional logger
    professionalLogger.critical(`Error Boundary: ${level} - ${name}`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      retryCount: this.state.retryCount,
      props: this.props
    });

    this.setState({ errorInfo });

    if (onError) {
      onError(error, errorInfo);
    }

    // Auto-report critical errors
    if (level === 'page' && this.props.enableReporting !== false) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    this.setState({ isReporting: true });
    
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId,
        level: this.props.level,
        component: this.props.name,
        retryCount: this.state.retryCount
      };

      // Future: Send to error reporting service
      professionalLogger.info('Error report generated', { errorReport });
      
      setTimeout(() => {
        this.setState({ isReporting: false });
      }, 2000);
    } catch (reportingError) {
      professionalLogger.error('Failed to report error', { reportingError });
      this.setState({ isReporting: false });
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      professionalLogger.info(`Retrying ${this.props.name}`, { 
        attempt: retryCount + 1, 
        maxRetries: this.maxRetries 
      });
      
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1 
      });
    }
  };

  private handleReload = () => {
    professionalLogger.info(`Reloading page due to error in ${this.props.name}`);
    window.location.reload();
  };

  private handleGoHome = () => {
    professionalLogger.info(`Navigating home due to error in ${this.props.name}`);
    window.location.href = '/';
  };

  private copyErrorDetails = async () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      component: this.props.name,
      level: this.props.level,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      professionalLogger.info('Error details copied to clipboard');
    } catch (err) {
      professionalLogger.error('Failed to copy error details', { err });
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
          bg: 'bg-gradient-to-br from-red-50 to-red-100',
          text: 'text-red-700',
          button: 'border-red-300 text-red-700 hover:bg-red-100'
        };
      case 'medium':
        return {
          border: 'border-orange-400',
          bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
          text: 'text-orange-700',
          button: 'border-orange-300 text-orange-700 hover:bg-orange-100'
        };
      case 'low':
        return {
          border: 'border-yellow-400',
          bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
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

      return (
        <Card className={`${theme.border} ${theme.bg} shadow-lg border-2`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${theme.text}`}>
              <div className="p-2 rounded-full bg-white/50">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  Erro {severity === 'high' ? 'Crítico' : severity === 'medium' ? 'Moderado' : 'Leve'}
                </div>
                <div className="text-sm font-normal opacity-75">
                  {this.props.name}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className={`${theme.text} leading-relaxed`}>
                {severity === 'high' 
                  ? 'Ocorreu um erro crítico que impediu o funcionamento desta página. Nossa equipe foi notificada automaticamente.'
                  : severity === 'medium'
                  ? 'Ocorreu um erro que afetou esta seção. Você pode tentar novamente ou continuar usando outras partes do app.'
                  : 'Ocorreu um erro menor neste componente. O resto do aplicativo continua funcionando normalmente.'
                }
              </p>
              
              {this.state.retryCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 rounded-lg p-3">
                  <Bug className="w-4 h-4" />
                  <span>Tentativas: {this.state.retryCount}/{this.maxRetries}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className={`${theme.button} shadow-sm`}
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

              <Button 
                onClick={this.copyErrorDetails}
                variant="outline"
                size="sm"
                className={theme.button}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Detalhes
              </Button>

              {this.props.enableReporting !== false && (
                <Button 
                  onClick={() => this.reportError(this.state.error!, this.state.errorInfo!)}
                  variant="outline"
                  size="sm"
                  className={theme.button}
                  disabled={this.state.isReporting}
                >
                  {this.state.isReporting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {this.state.isReporting ? 'Enviando...' : 'Reportar Erro'}
                </Button>
              )}
            </div>

            {!canRetry && severity !== 'high' && (
              <div className="text-sm text-gray-600 bg-white/50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="font-medium mb-1">Máximo de tentativas atingido</p>
                    <p>Se o problema persistir, tente recarregar a página ou entre em contato com o suporte.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
