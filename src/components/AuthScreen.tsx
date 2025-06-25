
import AuthForm from "@/features/auth/components/AuthForm";

const AuthScreen = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-2">SB2coach.ai</h1>
          <p className="text-slate-600">Sua jornada de emagrecimento inteligente</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthScreen;
