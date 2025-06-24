
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthToggleButtons from "@/components/auth/AuthToggleButtons";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import FormDivider from "@/components/auth/FormDivider";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import EmailVerificationScreen from "@/components/auth/EmailVerificationScreen";
import { useAuthOperations } from "@/hooks/useAuthOperations";

export type AuthMode = 'signin' | 'signup' | 'magic-link' | 'forgot-password' | 'email-verification';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [emailForVerification, setEmailForVerification] = useState<string>('');
  const { loading, handleGoogleAuth, handleEmailAuth, handleForgotPassword, handleMagicLink } = useAuthOperations();

  const handleModeChange = (newMode: AuthMode, email?: string) => {
    setMode(newMode);
    if (email) {
      setEmailForVerification(email);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleEmailFormSubmit = (email: string, password: string, name: string) => {
    const isLogin = mode === 'signin';
    const onEmailVerification = () => handleModeChange('email-verification', email);
    handleEmailAuth(email, password, name, isLogin, onEmailVerification);
  };

  if (mode === 'email-verification') {
    return (
      <EmailVerificationScreen 
        email={emailForVerification}
        onBackToLogin={() => setMode('signin')}
      />
    );
  }

  if (mode === 'forgot-password') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <AuthHeader isLogin={true} />
          <ForgotPasswordForm 
            onSubmit={handleForgotPassword}
            onBackToLogin={() => setMode('signin')}
            loading={loading}
          />
        </CardContent>
      </Card>
    );
  }

  if (mode === 'magic-link') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <AuthHeader isLogin={true} />
          <MagicLinkForm 
            onSubmit={handleMagicLink}
            onBackToLogin={() => setMode('signin')}
            loading={loading}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <AuthHeader isLogin={mode === 'signin'} />
        
        <div className="space-y-4">
          <AuthToggleButtons 
            isLogin={mode === 'signin'}
            onToggleMode={handleToggleMode}
            onForgotPassword={() => setMode('forgot-password')}
          />
          
          <GoogleAuthButton onClick={handleGoogleAuth} disabled={loading} />
          
          <FormDivider />
          
          <EmailPasswordForm 
            isLogin={mode === 'signin'}
            onSubmit={handleEmailFormSubmit}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
