
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
          className="text-primary hover:text-primary/90 hover:bg-primary/10"
          style={{ color: 'rgb(149, 6, 6)' }}
        >
          Esqueceu sua senha?
        </Button>
      )}
      
      <div className="text-sm text-muted-foreground">
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <Button 
          type="button"
          variant="ghost"
          onClick={onToggleMode}
          className="ml-1 text-primary hover:text-primary/90 hover:bg-primary/10 p-0 h-auto font-semibold"
          style={{ color: 'rgb(149, 6, 6)', padding: '0', height: 'auto' }}
        >
          {isLogin ? 'Crie uma conta' : 'Faça login'}
        </Button>
      </div>
    </div>
  );
};

export default AuthToggleButtons;
