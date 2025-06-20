
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import AuthHeader from './AuthHeader';
import EmailPasswordForm from './EmailPasswordForm';
import FormDivider from './FormDivider';
import AuthToggleButtons from './AuthToggleButtons';

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
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 white-bg-safe">
      <Card className="w-full max-w-md bg-white dark:bg-card border-0 shadow-none">
        <AuthHeader isLogin={isLogin} />
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

          <FormDivider />

          <EmailPasswordForm 
            isLogin={isLogin}
            onSubmit={onEmailAuth}
            loading={loading}
          />

          <AuthToggleButtons 
            isLogin={isLogin}
            onToggleMode={onToggleMode}
            onForgotPassword={onForgotPassword}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
