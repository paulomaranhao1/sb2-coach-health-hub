import AuthForm from "@/features/auth/components/AuthForm";
const AuthScreen = () => {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <section className="w-full max-w-md">
        <AuthForm />
      </section>
    </main>
  );
};
export default AuthScreen;