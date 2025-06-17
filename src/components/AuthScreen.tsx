
import { useState } from 'react';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import AuthForm from './auth/AuthForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import EmailVerificationScreen from './auth/EmailVerificationScreen';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [email, setEmail] = useState('');
  
  const { loading, handleGoogleAuth, handleEmailAuth, handleForgotPassword } = useAuthOperations();

  const onEmailAuth = (emailValue: string, password: string, name: string) => {
    setEmail(emailValue);
    handleEmailAuth(emailValue, password, name, isLogin, () => setShowEmailVerification(true));
  };

  const onForgotPassword = (emailValue: string) => {
    return handleForgotPassword(emailValue);
  };

  const resetToLogin = () => {
    setShowEmailVerification(false);
    setIsForgotPassword(false);
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

  return (
    <AuthForm
      isLogin={isLogin}
      onToggleMode={() => setIsLogin(!isLogin)}
      onGoogleAuth={handleGoogleAuth}
      onEmailAuth={onEmailAuth}
      onForgotPassword={() => setIsForgotPassword(true)}
      loading={loading}
    />
  );
};

export default AuthScreen;
