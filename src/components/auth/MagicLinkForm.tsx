
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md bg-card border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg p-2 bg-white">
              <img 
                src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
                alt="SB2 Coach Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
            <CardTitle className="text-2xl font-bold text-foreground">
              Email Enviado!
            </CardTitle>
            <CardDescription className="font-semibold text-muted-foreground">
              Enviamos um link mágico para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e clique no link para fazer login.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={onBackToLogin}
                className="text-sm font-bold text-primary hover:text-primary/90 hover:bg-primary/10"
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-card border">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg p-2 bg-white">
            <img 
              src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl font-bold text-foreground">
            Link Mágico
          </CardTitle>
          <CardDescription className="font-semibold text-muted-foreground">
            Entre sem senha! Enviaremos um link mágico para seu email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-bold text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground font-semibold"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground" 
              disabled={loading || !email.trim()}
            >
              {loading ? 'Enviando...' : 'Enviar Link Mágico'}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={onBackToLogin}
              className="text-sm font-bold text-primary hover:text-primary/90 hover:bg-primary/10"
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
