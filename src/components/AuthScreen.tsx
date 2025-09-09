import AuthForm from "@/features/auth/components/AuthForm";

const AuthScreen = () => {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Modern Background with Subtle Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, rgb(59 130 246) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgb(147 51 234) 2%, transparent 0%)`,
        backgroundSize: '100px 100px'
      }}></div>
      
      <section className="relative w-full max-w-md animate-fade-in">
        <AuthForm />
      </section>
    </main>
  );
};
export default AuthScreen;