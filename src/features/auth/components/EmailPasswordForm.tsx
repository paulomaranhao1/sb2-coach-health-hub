
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { AuthMode } from './AuthForm';

interface EmailPasswordFormProps {
  mode: AuthMode;
  onSuccess?: (email: string) => void;
  onForgotPassword?: () => void;
  onMagicLink?: () => void;
}

const EmailPasswordForm = ({ mode, onSuccess, onForgotPassword, onMagicLink }: EmailPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, loading } = useEmailAuth();

  const isLogin = mode === 'signin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const result = await signUp(email, password);
        if (result && onSuccess) {
          onSuccess(email);
        }
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            disabled={loading}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
        style={{ 
          backgroundColor: 'rgb(220, 38, 38)', 
          color: 'rgb(255, 255, 255)' 
        }}
      >
        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
      </Button>

      {isLogin && (
        <div className="flex flex-col gap-2 text-center">
          <Button 
            type="button"
            variant="ghost"
            onClick={onForgotPassword}
            className="text-sm"
            disabled={loading}
          >
            Esqueceu sua senha?
          </Button>
          <Button 
            type="button"
            variant="ghost"
            onClick={onMagicLink}
            className="text-sm"
            disabled={loading}
          >
            Entrar com Link Mágico
          </Button>
        </div>
      )}
    </form>
  );
};

export default EmailPasswordForm;
