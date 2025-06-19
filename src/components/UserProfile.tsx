import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserStats = Database['public']['Tables']['user_stats']['Row'];

const UserProfile = () => {
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

  const getShieldInfo = (shieldId: string) => {
    const shields = {
      'first_weight': { name: 'Primeira Pesagem', emoji: '⚖️', description: 'Registrou o primeiro peso!' },
      'goal_achiever': { name: 'Conquistador', emoji: '🎯', description: 'Está perdendo peso!' },
      'consistent': { name: 'Consistente', emoji: '📈', description: 'Registro por 7 dias seguidos!' },
      'champion': { name: 'Campeão', emoji: '🏆', description: 'Alcançou 30 dias de registro!' },
      'dedicated': { name: 'Dedicado', emoji: '💪', description: 'Atingiu 100 pontos!' }
    };
    return shields[shieldId as keyof typeof shields] || { name: shieldId, emoji: '🛡️', description: 'Escudo conquistado!' };
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

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: profile.name,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal_weight: profile.goal_weight,
            gender: profile.gender,
            phone_number: profile.phone_number,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao atualizar perfil:', error);
          toast.error('Erro ao salvar perfil');
          return;
        }
      } else {
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            name: profile.name,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            goal_weight: profile.goal_weight,
            gender: profile.gender,
            phone_number: profile.phone_number
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
    <div className="space-y-6">
      {/* Escudos Conquistados */}
      {userStats && userStats.shields && userStats.shields.length > 0 && (
        <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Shield className="w-6 h-6" />
              Escudos Conquistados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {userStats.shields.map((shieldId, index) => {
                const shield = getShieldInfo(shieldId);
                return (
                  <Badge 
                    key={index}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2"
                  >
                    <span className="text-lg">{shield.emoji}</span>
                    <div className="flex flex-col">
                      <span>{shield.name}</span>
                      <span className="text-xs opacity-90">{shield.description}</span>
                    </div>
                  </Badge>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-yellow-700">
              <Trophy className="w-4 h-4" />
              <span>Continue registrando seu peso diariamente para conquistar mais escudos!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário do Perfil */}
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
            <Label htmlFor="phone_number">Telefone/WhatsApp</Label>
            <Input
              type="tel"
              id="phone_number"
              placeholder="Seu número de telefone"
              value={profile?.phone_number || ''}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
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
    </div>
  );
};

export default UserProfile;
