
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserStats = Database['public']['Tables']['user_stats']['Row'];

export const useUserProfile = (onSaveSuccess?: () => void) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao buscar perfil:', error);
          toast.error('Erro ao carregar perfil');
          return;
        }

        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao buscar estatísticas:', error);
          return;
        }

        setUserStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não encontrado');
        return;
      }

      // Sempre usar upsert para evitar erro de chave duplicada
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          name: profile.name,
          age: profile.age,
          height: profile.height,
          weight: profile.weight,
          goal_weight: profile.goal_weight,
          gender: profile.gender,
          phone_number: profile.phone_number,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        toast.error('Erro ao salvar perfil');
        return;
      }

      toast.success('Perfil salvo com sucesso!');
      if (onSaveSuccess) {
        setTimeout(onSaveSuccess, 1000); // Aguarda 1 segundo para mostrar o toast
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    setProfile,
    userStats,
    isLoading,
    isSaving,
    handleSave
  };
};
