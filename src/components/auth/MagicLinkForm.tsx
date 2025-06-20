
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { toastFeedback } from '@/components/ui/toast-feedback';

interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<boolean>;
  onBackToLogin: () => void;
  loading: boolean;
}

const MagicLinkForm = ({ onSubmit, onBackToLogin, loading }: MagicLinkFormProps) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toastFeedback.error('Por favor, insira um email válido');
      return;
    }

    try {
      const result = await onSubmit(email);
      if (result) {
        setSuccess(true);
        toastFeedback.success('Link mágico enviado! Verifique seu email.');
      }
    } catch (error) {
      console.error('Erro ao enviar link mágico:', error);
      toastFeedback.error('Erro ao enviar link mágico. Tente novamente.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-card border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
              <img 
                src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
                alt="SB2FIT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Email Enviado!</CardTitle>
            <CardDescription className="text-slate-700 dark:text-slate-300">
              Enviamos um link mágico para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e clique no link para fazer login.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={onBackToLogin}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-card border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
            <img 
              src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
              alt="SB2FIT Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Link Mágico</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Entre sem senha! Enviaremos um link mágico para seu email
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
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
              disabled={loading || !email.trim()}
            >
              {loading ? 'Enviando...' : 'Enviar Link Mágico'}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onBackToLogin}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              disabled={loading}
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

export default MagicLinkForm;
