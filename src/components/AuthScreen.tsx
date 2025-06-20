
import { useState } from 'react';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import AuthForm from './auth/AuthForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import EmailVerificationScreen from './auth/EmailVerificationScreen';
import MagicLinkForm from './auth/MagicLinkForm';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  
  const { loading, handleGoogleAuth, handleEmailAuth, handleForgotPassword, handleMagicLink } = useAuthOperations();

  const onEmailAuth = (emailValue: string, password: string, name: string) => {
    setEmail(emailValue);
    handleEmailAuth(emailValue, password, name, isLogin, () => setShowEmailVerification(true));
  };

  const onForgotPassword = (emailValue: string) => {
    return handleForgotPassword(emailValue);
  };

  const onMagicLink = (emailValue: string) => {
    setEmail(emailValue);
    return handleMagicLink(emailValue);
  };

  const resetToLogin = () => {
    setShowEmailVerification(false);
    setIsForgotPassword(false);
    setShowMagicLink(false);
    setIsLogin(true);
  };

  if (showEmailVerification) {
    return (
      <EmailVerificationScreen 
        email={email} 
        onBackToLogin={resetToLogin}
      />
    );
  }

  if (isForgotPassword) {
    return (
      <ForgotPasswordForm
        onSubmit={onForgotPassword}
        onBackToLogin={() => setIsForgotPassword(false)}
        loading={loading}
      />
    );
  }

  if (showMagicLink) {
    return (
      <MagicLinkForm
        onSubmit={onMagicLink}
        onBackToLogin={() => setShowMagicLink(false)}
        loading={loading}
      />
    );
  }

  return (
    <div 
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      style={{ 
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(26, 26, 26)',
        minHeight: '100vh'
      }}
    >
      <AuthForm
        isLogin={isLogin}
        onToggleMode={() => setIsLogin(!isLogin)}
        onGoogleAuth={handleGoogleAuth}
        onEmailAuth={onEmailAuth}
        onForgotPassword={() => setIsForgotPassword(true)}
        onMagicLink={() => setShowMagicLink(true)}
        loading={loading}
      />
    </div>
  );
};

export default AuthScreen;
