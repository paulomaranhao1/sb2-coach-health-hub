import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Trophy, Target, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    age: '',
    gender: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
      } else {
        setUserProfile(profile);
        if (profile) {
          setFormData({
            name: (profile as any).name || '',
            weight: profile.weight?.toString() || '',
            height: profile.height?.toString() || '',
            age: profile.age?.toString() || '',
            gender: profile.gender || ''
          });
        }
      }

      // Buscar estatísticas do usuário
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) {
        console.error('Erro ao buscar estatísticas:', statsError);
      } else {
        setUserStats(stats);
      }

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Create update object with only known fields
      const updateData: any = {
        user_id: user.id,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
        age: parseInt(formData.age) || null,
        gender: formData.gender || null,
        onboarding_completed: true
      };

      // Only add name if it's provided (will work after migration)
      if (formData.name) {
        updateData.name = formData.name;
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(updateData);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      setIsEditing(false);
      fetchUserData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const calculateBMI = () => {
    if (userProfile?.weight && userProfile?.height) {
      const heightInMeters = userProfile.height / 100;
      const bmi = userProfile.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'bg-blue-500' };
    if (bmi < 25) return { category: 'Peso normal', color: 'bg-green-500' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'bg-yellow-500' };
    return { category: 'Obesidade', color: 'bg-red-500' };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiData = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <User className="w-8 h-8" />
          Meu Perfil
        </h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Como gostaria de ser chamado(a)?"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-gray-300">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Ex: 70.5"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-gray-300">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Ex: 175"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-gray-300">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Ex: 30"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-gray-300">Gênero</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Prefiro não informar</option>
                  </select>
                </div>
                <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700">
                  Salvar Alterações
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nome:</span>
                  <span className="text-white font-medium">
                    {(userProfile as any)?.name || 'Não informado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Peso:</span>
                  <span className="text-white font-medium">
                    {userProfile?.weight ? `${userProfile.weight} kg` : 'Não informado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Altura:</span>
                  <span className="text-white font-medium">
                    {userProfile?.height ? `${userProfile.height} cm` : 'Não informado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Idade:</span>
                  <span className="text-white font-medium">
                    {userProfile?.age ? `${userProfile.age} anos` : 'Não informado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gênero:</span>
                  <span className="text-white font-medium">
                    {userProfile?.gender ? 
                      userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : 
                      'Não informado'
                    }
                  </span>
                </div>
                
                {!userProfile && (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-3">Nenhuma informação encontrada</p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Adicionar Informações
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* IMC */}
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Índice de Massa Corporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bmi && bmiData ? (
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-white">{bmi}</div>
                <Badge className={`${bmiData.color} text-white px-4 py-2`}>
                  {bmiData.category}
                </Badge>
                <p className="text-gray-400 text-sm">
                  Baseado no seu peso e altura atuais
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {!userProfile?.weight || !userProfile?.height ? 
                    'Adicione seu peso e altura para calcular o IMC' :
                    'Dados insuficientes'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas de Gamificação */}
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Estatísticas do Jogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{userStats.points}</div>
                  <div className="text-gray-400 text-sm">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{userStats.level}</div>
                  <div className="text-gray-400 text-sm">Nível</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{userStats.streak}</div>
                  <div className="text-gray-400 text-sm">Sequência</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {userStats.shields?.length || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Conquistas</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Estatísticas não encontradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
