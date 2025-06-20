
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailVerificationScreenProps {
  email: string;
  onBackToLogin: () => void;
}

const EmailVerificationScreen = ({ email, onBackToLogin }: EmailVerificationScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-card border border-slate-200 dark:border-border">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
            <img 
              src="/lovable-uploads/24250820-08cd-44d8-97c2-decc25363123.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-green-600">Conta criada com sucesso!</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Verifique seu email para confirmar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Importante:</strong> Enviamos um email de confirmação para <strong>{email}</strong>. 
              Clique no link do email para ativar sua conta e começar a usar o SB2 Coach.
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.
            </p>
            
            <Button 
              variant="outline" 
              onClick={onBackToLogin}
              className="w-full text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationScreen;
