
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
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgb(255, 255, 255)' }}
    >
      <Card 
        className="w-full max-w-md border"
        style={{ 
          backgroundColor: 'rgb(255, 255, 255)', 
          borderColor: 'rgb(229, 231, 235)' 
        }}
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
          <CardTitle 
            className="text-2xl font-bold"
            style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
          >
            Recuperar Senha
          </CardTitle>
          <CardDescription 
            className="font-semibold"
            style={{ color: 'rgb(122, 122, 122)', fontWeight: '600' }}
          >
            Digite seu email para receber um link de redefinição
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
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full font-bold" 
              disabled={loading}
              style={{ 
                backgroundColor: 'rgb(149, 6, 6)', 
                color: 'rgb(255, 255, 255)', 
                fontWeight: '700' 
              }}
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={onBackToLogin}
              className="text-sm flex items-center justify-center gap-2 font-bold"
              style={{ color: 'rgb(149, 6, 6)', fontWeight: '700' }}
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
