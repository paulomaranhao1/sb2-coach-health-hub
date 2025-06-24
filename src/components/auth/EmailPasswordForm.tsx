
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmailPasswordFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string, name: string) => void;
  loading: boolean;
}

const EmailPasswordForm = ({ isLogin, onSubmit, loading }: EmailPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && (!acceptTerms || !acceptPrivacy)) {
      return; // Não submete se os termos não foram aceitos
    }
    
    onSubmit(email, password, name);
  };

  const isFormValid = isLogin || (acceptTerms && acceptPrivacy && name.trim());

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

      {!isLogin && (
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="accept-terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              disabled={loading}
            />
            <Label htmlFor="accept-terms" className="text-sm leading-5">
              Li e aceito os{' '}
              <Link 
                to="/terms-of-service" 
                target="_blank"
                className="text-red-600 hover:text-red-700 underline"
              >
                Termos de Uso
              </Link>
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="accept-privacy"
              checked={acceptPrivacy}
              onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
              disabled={loading}
            />
            <Label htmlFor="accept-privacy" className="text-sm leading-5">
              Li e aceito a{' '}
              <Link 
                to="/privacy-policy" 
                target="_blank"
                className="text-red-600 hover:text-red-700 underline"
              >
                Política de Privacidade
              </Link>
            </Label>
          </div>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !isFormValid}
        style={{ 
          backgroundColor: 'rgb(220, 38, 38)', 
          color: 'rgb(255, 255, 255)' 
        }}
      >
        {isLogin ? 'Entrar' : 'Criar Conta'}
      </Button>
    </form>
  );
};

export default EmailPasswordForm;
