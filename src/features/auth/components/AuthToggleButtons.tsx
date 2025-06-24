
import { Button } from '@/components/ui/button';
import { AuthMode } from './AuthForm';

interface AuthToggleButtonsProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

const AuthToggleButtons = ({ mode, onModeChange }: AuthToggleButtonsProps) => {
  const isLogin = mode === 'signin';

  return (
    <div className="flex gap-2">
      <Button 
        type="button"
        variant={isLogin ? "default" : "outline"}
        onClick={() => onModeChange('signin')}
        className="flex-1"
      >
        Entrar
      </Button>
      <Button 
        type="button"
        variant={!isLogin ? "default" : "outline"}
        onClick={() => onModeChange('signup')}
        className="flex-1"
      >
        Criar Conta
      </Button>
    </div>
  );
};

export default AuthToggleButtons;
