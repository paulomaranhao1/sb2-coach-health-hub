
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
  );
};

export default EmailPasswordForm;
