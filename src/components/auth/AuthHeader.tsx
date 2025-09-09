
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center pb-6">
      <div 
        className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl p-3 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 border border-white/60 hover:scale-105 transition-all duration-300"
      >
        <img 
          src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
          alt="SB2 Coach Logo" 
          className="w-full h-full object-contain animate-fade-in"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
        SB2 Coach
      </CardTitle>
      <CardDescription className="text-slate-600 font-medium text-base">
        {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
