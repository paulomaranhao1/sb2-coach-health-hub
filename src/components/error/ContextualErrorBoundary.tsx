
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  context: 'auth' | 'data' | 'ui' | 'navigation' | 'payment';
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class ContextualErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { context, onError } = this.props;
    
    logger.error(`Contextual Error in ${context}`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context,
      retryCount: this.state.retryCount
    });

    this.setState({ errorInfo });

    if (onError) {
      onError(error, errorInfo);
    }
  }

  private getContextConfig = () => {
    const { context } = this.props;
    
    const configs = {
      auth: {
        title: 'Erro de Autenticação',
        description: 'Ocorreu um problema com o login. Tente fazer login novamente.',
        color: 'border-red-500 bg-red-50',
        textColor: 'text-red-700',
        buttonColor: 'border-red-300 text-red-700 hover:bg-red-100',
        actions: ['retry', 'reload']
      },
      data: {
        title: 'Erro ao Carregar Dados',
        description: 'Não foi possível carregar os dados. Verifique sua conexão.',
        color: 'border-orange-400 bg-orange-50',
        textColor: 'text-orange-700',
        buttonColor: 'border-orange-300 text-orange-700 hover:bg-orange-100',
        actions: ['retry', 'refresh']
      },
      ui: {
        title: 'Erro de Interface',
        description: 'Ocorreu um problema com a interface. Tente atualizar a página.',
        color: 'border-yellow-400 bg-yellow-50',
        textColor: 'text-yellow-700',
        buttonColor: 'border-yellow-300 text-yellow-700 hover:bg-yellow-100',
        actions: ['retry']
      },
      navigation: {
        title: 'Erro de Navegação',
        description: 'Problema ao navegar. Retorne à página inicial.',
        color: 'border-blue-400 bg-blue-50',
        textColor: 'text-blue-700',
        buttonColor: 'border-blue-300 text-blue-700 hover:bg-blue-100',
        actions: ['home', 'retry']
      },
      payment: {
        title: 'Erro de Pagamento',
        description: 'Ocorreu um problema com o pagamento. Tente novamente.',
        color: 'border-purple-400 bg-purple-50',
        textColor: 'text-purple-700',
        buttonColor: 'border-purple-300 text-purple-700 hover:bg-purple-100',
        actions: ['retry', 'reload']
      }
    };

    return configs[context] || configs.ui;
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      logger.info(`Retrying ${this.props.context} (attempt ${retryCount + 1}/${this.maxRetries})`);
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1 
      });
    }
  };

  private handleReload = () => {
    logger.info(`Reloading page due to ${this.props.context} error`);
    window.location.reload();
  };

  private handleGoHome = () => {
    logger.info(`Navigating to home due to ${this.props.context} error`);
    window.location.href = '/';
  };

  private handleRefresh = () => {
    logger.info(`Refreshing data due to ${this.props.context} error`);
    // Trigger a refresh by clearing relevant caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    this.handleRetry();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const config = this.getContextConfig();
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <Card className={`${config.color} shadow-lg`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${config.textColor}`}>
              <AlertTriangle className="w-5 h-5" />
              {config.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={config.textColor}>
              {config.description}
            </p>

            {this.state.retryCount > 0 && (
              <p className="text-sm text-gray-600">
                Tentativas: {this.state.retryCount}/{this.maxRetries}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {config.actions.includes('retry') && canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className={config.buttonColor}
                  aria-label={`Tentar novamente - tentativa ${this.state.retryCount + 1} de ${this.maxRetries}`}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}

              {config.actions.includes('refresh') && (
                <Button 
                  onClick={this.handleRefresh}
                  variant="outline"
                  size="sm"
                  className={config.buttonColor}
                  aria-label="Atualizar dados"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              )}

              {config.actions.includes('reload') && (
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  size="sm"
                  className={config.buttonColor}
                  aria-label="Recarregar página"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar
                </Button>
              )}

              {config.actions.includes('home') && (
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="sm"
                  className={config.buttonColor}
                  aria-label="Ir para página inicial"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Início
                </Button>
              )}
            </div>

            {!canRetry && (
              <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                <Bug className="w-4 h-4 inline mr-2" />
                Número máximo de tentativas atingido. 
                {config.actions.includes('reload') && ' Tente recarregar a página.'}
              </div>
            )}

            {import.meta.env.DEV && this.state.error && (
              <details className="text-sm">
                <summary className={`cursor-pointer font-medium ${config.textColor}`}>
                  Detalhes do Erro (Desenvolvimento)
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
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ContextualErrorBoundary;
