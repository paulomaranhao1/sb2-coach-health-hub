
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <Card 
        className="w-full max-w-md bg-card border border-border shadow-lg transition-colors duration-300"
        style={{ backgroundColor: 'rgb(255, 255, 255)', borderColor: 'rgb(229, 231, 235)' }}
      >
        <AuthHeader isLogin={isLogin} />
        <CardContent className="space-y-4">
          <GoogleAuthButton onClick={onGoogleAuth} disabled={loading} />

          <Button 
            onClick={onMagicLink} 
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-all duration-200"
            style={{ 
              backgroundColor: 'rgb(122, 122, 122)', 
              color: 'rgb(255, 255, 255)', 
              fontWeight: '700' 
            }}
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
