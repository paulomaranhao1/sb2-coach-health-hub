
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'] & {
  goal_weight?: number;
};

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
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

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não encontrado');
        return;
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: profile.name,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal_weight: profile.goal_weight,
            gender: profile.gender,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao atualizar perfil:', error);
          toast.error('Erro ao salvar perfil');
          return;
        }
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            name: profile.name,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal_weight: profile.goal_weight,
            gender: profile.gender
          });

        if (error) {
          console.error('Erro ao criar perfil:', error);
          toast.error('Erro ao salvar perfil');
          return;
        }
      }

      toast.success('Perfil salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Perfil</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={profile?.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="age">Idade</Label>
          <Input
            type="number"
            id="age"
            placeholder="Sua idade"
            value={profile?.age?.toString() || ''}
            onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            type="number"
            id="height"
            placeholder="Sua altura em cm"
            value={profile?.height?.toString() || ''}
            onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            type="number"
            id="weight"
            placeholder="Seu peso em kg"
            value={profile?.weight?.toString() || ''}
            onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="goal_weight">Peso Desejado (kg)</Label>
          <Input
            type="number"
            id="goal_weight"
            placeholder="Seu peso desejado em kg"
            value={profile?.goal_weight?.toString() || ''}
            onChange={(e) => setProfile({ ...profile, goal_weight: parseFloat(e.target.value) })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select onValueChange={(value) => setProfile({ ...profile, gender: value })} value={profile?.gender || ''}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Perfil'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
