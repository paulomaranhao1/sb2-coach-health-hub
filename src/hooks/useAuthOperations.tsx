
import { useGoogleAuth } from './auth/useGoogleAuth';
import { useEmailAuth } from './auth/useEmailAuth';
import { usePasswordAuth } from './auth/usePasswordAuth';

export const useAuthOperations = () => {
  const { loading: googleLoading, handleGoogleAuth } = useGoogleAuth();
  const { loading: emailLoading, handleEmailAuth } = useEmailAuth();
  const { loading: passwordLoading, handleMagicLink, handleForgotPassword } = usePasswordAuth();

  const loading = googleLoading || emailLoading || passwordLoading;

  return {
    loading,
    handleGoogleAuth,
    handleEmailAuth,
    handleForgotPassword,
    handleMagicLink
  };
};
