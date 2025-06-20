
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
        <img 
          src="/lovable-uploads/24250820-08cd-44d8-97c2-decc25363123.png" 
          alt="SB2 Coach Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <CardTitle 
        className="text-2xl font-bold text-slate-800 dark:text-slate-100 force-readable"
        style={{ color: 'rgb(31, 41, 55)', fontWeight: '700' }}
      >
        SB2 Coach
      </CardTitle>
      <CardDescription 
        className="text-slate-700 dark:text-slate-300 force-readable"
        style={{ color: 'rgb(55, 65, 81)', fontWeight: '600' }}
      >
        {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
