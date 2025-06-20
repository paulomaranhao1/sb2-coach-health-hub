
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
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgb(255, 255, 255)' }}
      >
        <Card 
          className="w-full max-w-md border-0 shadow-none"
          style={{ backgroundColor: 'rgb(255, 255, 255)' }}
        >
          <CardHeader className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg p-2"
              style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            >
              <img 
                src="/lovable-uploads/24250820-08cd-44d8-97c2-decc25363123.png" 
                alt="SB2 Coach Logo" 
                className="w-full h-full object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgb(34, 197, 94)' }} />
            <CardTitle 
              className="text-2xl font-bold"
              style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
            >
              Email Enviado!
            </CardTitle>
            <CardDescription 
              className="font-semibold"
              style={{ color: 'rgb(122, 122, 122)', fontWeight: '600' }}
            >
              Enviamos um link mágico para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e clique no link para fazer login.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={onBackToLogin}
                className="text-sm font-bold"
                style={{ color: 'rgb(149, 6, 6)', fontWeight: '700' }}
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
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgb(255, 255, 255)' }}
    >
      <Card 
        className="w-full max-w-md border-0 shadow-none"
        style={{ backgroundColor: 'rgb(255, 255, 255)' }}
      >
        <CardHeader className="text-center">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg p-2"
            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
          >
            <img 
              src="/lovable-uploads/24250820-08cd-44d8-97c2-decc25363123.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
          <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgb(149, 6, 6)' }} />
          <CardTitle 
            className="text-2xl font-bold"
            style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
          >
            Link Mágico
          </CardTitle>
          <CardDescription 
            className="font-semibold"
            style={{ color: 'rgb(122, 122, 122)', fontWeight: '600' }}
          >
            Entre sem senha! Enviaremos um link mágico para seu email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label 
                htmlFor="email" 
                className="font-bold"
                style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgb(122, 122, 122)' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  style={{ 
                    backgroundColor: 'rgb(255, 255, 255)',
                    color: 'rgb(26, 26, 26)', 
                    borderColor: 'rgb(229, 231, 235)',
                    fontWeight: '600' 
                  }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full font-bold" 
              disabled={loading || !email.trim()}
              style={{ 
                backgroundColor: 'rgb(149, 6, 6)', 
                color: 'rgb(255, 255, 255)', 
                fontWeight: '700' 
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Link Mágico'}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={onBackToLogin}
              className="text-sm font-bold"
              style={{ color: 'rgb(149, 6, 6)', fontWeight: '700' }}
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
