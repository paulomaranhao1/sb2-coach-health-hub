
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface ProfileFormProps {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  onSave: () => void;
  isSaving: boolean;
}

const ProfileForm = ({ profile, setProfile, onSave, isSaving }: ProfileFormProps) => {
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
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Perfil'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
