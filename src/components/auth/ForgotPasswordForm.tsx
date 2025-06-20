
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<boolean>;
  onBackToLogin: () => void;
  loading: boolean;
}

const ForgotPasswordForm = ({ onSubmit, onBackToLogin, loading }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(email);
    if (success) {
      onBackToLogin();
    }
  };

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
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recuperar Senha</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Digite seu email para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onBackToLogin}
              className="text-sm flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
