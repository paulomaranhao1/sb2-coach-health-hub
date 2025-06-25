
import AuthForm from "@/features/auth/components/AuthForm";

const AuthScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">SB2coach.ai</h1>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthScreen;
