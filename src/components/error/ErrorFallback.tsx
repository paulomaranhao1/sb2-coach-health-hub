
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
}

const ErrorFallback = ({ 
  title = "Erro ao carregar", 
  message = "Ocorreu um erro ao carregar esta seção. Tente recarregar a página." 
}: ErrorFallbackProps) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-600">{message}</p>
      </CardContent>
    </Card>
  );
};

export default ErrorFallback;
