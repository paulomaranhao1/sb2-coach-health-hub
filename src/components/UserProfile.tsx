
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Home, Bell } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loading } from "@/components/ui/loading";
import ProfileForm from "./profile/ProfileForm";
import NotificationSettings from "./NotificationSettings";
import PasswordChangeForm from "./profile/PasswordChangeForm";

interface UserProfileProps {
  onNavigateToHome: () => void;
}

const UserProfile = ({ onNavigateToHome }: UserProfileProps) => {
  const { profile, setProfile, userStats, isLoading, isSaving, handleSave } = useUserProfile(onNavigateToHome);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading size="lg" text="Carregando perfil..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <User className="w-8 h-8" />
            Meu Perfil
          </CardTitle>
          <CardDescription className="text-blue-100">
            Gerencie suas informações pessoais e configurações
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Formulário do Perfil */}
      <ProfileForm 
        profile={profile}
        setProfile={setProfile}
        isSaving={isSaving}
        onSave={handleSave}
      />

      {/* Alterar Senha */}
      <PasswordChangeForm />

      {/* Configurações de Notificação */}
      <NotificationSettings />

      {/* Botão Voltar */}
      <div className="flex justify-center">
        <Button 
          onClick={onNavigateToHome}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
