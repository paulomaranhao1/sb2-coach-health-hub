
import { Button } from '@/components/ui/button';

interface AuthToggleButtonsProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

const AuthToggleButtons = ({ isLogin, onToggleMode, onForgotPassword }: AuthToggleButtonsProps) => {
  return (
    <>
      {isLogin && (
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={onForgotPassword}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 force-readable"
            style={{ color: 'rgb(75, 85, 99)', fontWeight: '700' }}
          >
            Esqueci minha senha
          </Button>
        </div>
      )}

      <div className="text-center">
        <Button 
          variant="link" 
          onClick={onToggleMode}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 force-readable"
          style={{ color: 'rgb(75, 85, 99)', fontWeight: '700' }}
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
        </Button>
      </div>
    </>
  );
};

export default AuthToggleButtons;
