
import AuthForm from "@/features/auth/components/AuthForm";

const AuthScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthScreen;
