
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <div 
        className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg p-2 bg-white"
        style={{ backgroundColor: 'rgb(255, 255, 255)' }}
      >
        <img 
          src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
          alt="SB2 Coach Logo" 
          className="w-full h-full object-contain"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
      <CardTitle 
        className="text-2xl font-bold text-foreground transition-colors duration-300"
        style={{ color: 'rgb(26, 26, 26)', fontWeight: '700' }}
      >
        SB2 Coach
      </CardTitle>
      <CardDescription 
        className="text-muted-foreground transition-colors duration-300"
        style={{ color: 'rgb(122, 122, 122)', fontWeight: '600' }}
      >
        {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
