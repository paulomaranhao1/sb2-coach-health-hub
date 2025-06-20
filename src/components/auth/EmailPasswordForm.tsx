
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';

interface EmailPasswordFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string, name: string) => void;
  loading: boolean;
}

const EmailPasswordForm = ({ isLogin, onSubmit, loading }: EmailPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div>
          <Label 
            htmlFor="name" 
            className="text-foreground font-bold transition-colors duration-300"
            style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
          >
            Nome Completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-background text-foreground border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-all duration-200"
              style={{ 
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(26, 26, 26)', 
                borderColor: 'rgb(229, 231, 235)',
                fontWeight: '600' 
              }}
              required={!isLogin}
            />
          </div>
        </div>
      )}
      
      <div>
        <Label 
          htmlFor="email" 
          className="text-foreground font-bold transition-colors duration-300"
          style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
        >
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
            className="pl-10 bg-background text-foreground border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-all duration-200"
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
      
      <div>
        <Label 
          htmlFor="password" 
          className="text-foreground font-bold transition-colors duration-300"
          style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
        >
          Senha
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-background text-foreground border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-all duration-200"
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
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all duration-200" 
        disabled={loading}
        style={{ backgroundColor: 'rgb(149, 6, 6)', color: 'rgb(255, 255, 255)', fontWeight: '700' }}
      >
        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
      </Button>
    </form>
  );
};

export default EmailPasswordForm;
