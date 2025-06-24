
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

export type AuthMode = 'signin' | 'signup' | 'magic-link' | 'forgot-password' | 'email-verification';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [emailForVerification, setEmailForVerification] = useState<string>('');

  const handleModeChange = (newMode: AuthMode, email?: string) => {
    setMode(newMode);
    if (email) {
      setEmailForVerification(email);
    }
  };

  if (mode === 'email-verification') {
    return (
      <EmailVerificationScreen 
        email={emailForVerification}
        onBack={() => setMode('signin')}
      />
    );
  }

  if (mode === 'forgot-password') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <AuthHeader mode={mode} />
          <ForgotPasswordForm onBack={() => setMode('signin')} />
        </CardContent>
      </Card>
    );
  }

  if (mode === 'magic-link') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <AuthHeader mode={mode} />
          <MagicLinkForm 
            onBack={() => setMode('signin')}
            onEmailSent={(email) => handleModeChange('email-verification', email)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <AuthHeader mode={mode} />
        
        <div className="space-y-4">
          <AuthToggleButtons mode={mode} onModeChange={setMode} />
          
          <GoogleAuthButton />
          
          <FormDivider />
          
          <EmailPasswordForm 
            mode={mode}
            onSuccess={(email) => {
              if (mode === 'signup') {
                handleModeChange('email-verification', email);
              }
            }}
            onForgotPassword={() => setMode('forgot-password')}
            onMagicLink={() => setMode('magic-link')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
