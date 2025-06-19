
import ShieldsDisplay from './profile/ShieldsDisplay';
import ProfileForm from './profile/ProfileForm';
import { useUserProfile } from '@/hooks/useUserProfile';

interface UserProfileProps {
  onNavigateToHome?: () => void;
}

const UserProfile = ({ onNavigateToHome }: UserProfileProps) => {
  const {
    profile,
    setProfile,
    userStats,
    isLoading,
    isSaving,
    handleSave
  } = useUserProfile(onNavigateToHome);

  if (isLoading) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="space-y-6">
      <ShieldsDisplay userStats={userStats} />
      <ProfileForm
        profile={profile}
        setProfile={setProfile}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default UserProfile;
