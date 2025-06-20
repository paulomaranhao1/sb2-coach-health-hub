

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onGoogleAuth: () => void;
  onEmailAuth: (email: string, password: string, name: string) => void;
  onForgotPassword: () => void;
  onMagicLink: () => void;
  loading: boolean;
}

const AuthForm = ({ 
  isLogin, 
  onToggleMode, 
  onGoogleAuth, 
  onEmailAuth, 
  onForgotPassword, 
  onMagicLink,
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 white-bg-safe">
      <Card className="w-full max-w-md bg-white dark:bg-card border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
            <img 
              src="/lovable-uploads/24250820-08cd-44d8-97c2-decc25363123.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle 
            className="text-2xl font-bold text-slate-800 dark:text-slate-100 force-readable"
            style={{ color: 'rgb(31, 41, 55)', fontWeight: '700' }}
          >
            SB2 Coach
          </CardTitle>
          <CardDescription 
            className="text-slate-700 dark:text-slate-300 force-readable"
            style={{ color: 'rgb(55, 65, 81)', fontWeight: '600' }}
          >
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleAuthButton onClick={onGoogleAuth} disabled={loading} />

          <Button 
            onClick={onMagicLink} 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            style={{ backgroundColor: 'rgb(147, 51, 234)', color: 'rgb(255, 255, 255)', fontWeight: '700' }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Entrar com Link Mágico
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span 
                className="bg-white dark:bg-card px-2 text-slate-600 dark:text-slate-400 force-readable"
                style={{ color: 'rgb(75, 85, 99)', fontWeight: '700' }}
              >
                Ou
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label 
                  htmlFor="name" 
                  className="text-slate-700 dark:text-slate-200 force-readable"
                  style={{ color: 'rgb(55, 65, 81)', fontWeight: '700' }}
                >
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 force-readable"
                    style={{ color: 'rgb(31, 41, 55)', fontWeight: '600' }}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label 
                htmlFor="email" 
                className="text-slate-700 dark:text-slate-200 force-readable"
                style={{ color: 'rgb(55, 65, 81)', fontWeight: '700' }}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 force-readable"
                  style={{ color: 'rgb(31, 41, 55)', fontWeight: '600' }}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="password" 
                className="text-slate-700 dark:text-slate-200 force-readable"
                style={{ color: 'rgb(55, 65, 81)', fontWeight: '700' }}
              >
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 force-readable"
                  style={{ color: 'rgb(31, 41, 55)', fontWeight: '600' }}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold primary-button" 
              disabled={loading}
              style={{ backgroundColor: 'rgb(220, 38, 38)', color: 'rgb(255, 255, 255)', fontWeight: '700' }}
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={onForgotPassword}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 force-readable"
                style={{ color: 'rgb(75, 85, 99)', fontWeight: '700' }}
              >
                Esqueci minha senha
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onToggleMode}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 force-readable"
              style={{ color: 'rgb(75, 85, 99)', fontWeight: '700' }}
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

