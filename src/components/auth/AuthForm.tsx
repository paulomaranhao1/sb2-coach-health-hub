
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onGoogleAuth: () => void;
  onEmailAuth: (email: string, password: string, name: string) => void;
  onForgotPassword: () => void;
  loading: boolean;
}

const AuthForm = ({ 
  isLogin, 
  onToggleMode, 
  onGoogleAuth, 
  onEmailAuth, 
  onForgotPassword, 
  loading 
}: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailAuth(email, password, name);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-card border border-slate-200 dark:border-border">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
            <img 
              src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
              alt="SB2FIT Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">SB2FIT</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleAuthButton onClick={onGoogleAuth} disabled={loading} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-card px-2 text-slate-600 dark:text-slate-400">Ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
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
            
            <div>
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-200">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={onForgotPassword}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Esqueci minha senha
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onToggleMode}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
