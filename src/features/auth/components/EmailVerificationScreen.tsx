
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailVerificationScreenProps {
  email: string;
  onBack: () => void;
}

const EmailVerificationScreen = ({ email, onBack }: EmailVerificationScreenProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
          <img 
            src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
            alt="SB2 Coach Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold text-green-600">Conta criada com sucesso!</CardTitle>
        <CardDescription>
          Verifique seu email para confirmar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Enviamos um email de confirmação para <strong>{email}</strong>. 
            Clique no link do email para ativar sua conta e começar a usar o SB2 Coach.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.
          </p>
          
          <Button variant="outline" onClick={onBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationScreen;
