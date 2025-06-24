
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthMode } from './AuthForm';

interface AuthHeaderProps {
  mode: AuthMode;
}

const AuthHeader = ({ mode }: AuthHeaderProps) => {
  const getTitle = () => {
    switch (mode) {
      case 'signin':
        return 'Entrar';
      case 'signup':
        return 'Criar Conta';
      case 'magic-link':
        return 'Link Mágico';
      case 'forgot-password':
        return 'Recuperar Senha';
      default:
        return 'SB2 Coach';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin':
        return 'Entre na sua conta';
      case 'signup':
        return 'Crie sua conta';
      case 'magic-link':
        return 'Entre sem senha';
      case 'forgot-password':
        return 'Digite seu email para recuperar';
      default:
        return 'Sua jornada de emagrecimento inteligente';
    }
  };

  return (
    <CardHeader className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg p-2 bg-white">
        <img 
          src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
          alt="SB2 Coach Logo" 
          className="w-full h-full object-contain"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
      <CardTitle className="text-2xl font-bold text-slate-700">
        {getTitle()}
      </CardTitle>
      <CardDescription className="text-slate-500 font-medium">
        {getDescription()}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
