
import { Button } from '@/components/ui/button';

interface AuthToggleButtonsProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

const AuthToggleButtons = ({ isLogin, onToggleMode, onForgotPassword }: AuthToggleButtonsProps) => {
  return (
    <div className="space-y-2 text-center">
      {isLogin && (
        <Button 
          type="button"
          variant="ghost"
          onClick={onForgotPassword}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          style={{ color: 'rgb(37, 99, 235)' }}
        >
          Esqueceu sua senha?
        </Button>
      )}
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <Button 
          type="button"
          variant="ghost"
          onClick={onToggleMode}
          className="ml-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold"
          style={{ color: 'rgb(37, 99, 235)', padding: '0', height: 'auto' }}
        >
          {isLogin ? 'Crie uma conta' : 'Faça login'}
        </Button>
      </div>
    </div>
  );
};

export default AuthToggleButtons;
