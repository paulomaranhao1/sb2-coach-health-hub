
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Loading } from '@/components/ui/loading';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface ProfileFormProps {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  onSave: () => void;
  isSaving: boolean;
}

const ProfileForm = ({ profile, setProfile, onSave, isSaving }: ProfileFormProps) => {
  const validationSchema = {
    name: [
      { required: true, message: "Nome é obrigatório" },
      { minLength: 2, message: "Nome deve ter pelo menos 2 caracteres" },
      { maxLength: 50, message: "Nome deve ter no máximo 50 caracteres" }
    ],
    age: [
      { required: true, message: "Idade é obrigatória" },
      { min: 13, message: "Idade deve ser pelo menos 13 anos" },
      { max: 120, message: "Idade deve ser no máximo 120 anos" }
    ],
    height: [
      { required: true, message: "Altura é obrigatória" },
      { min: 100, message: "Altura deve ser pelo menos 100cm" },
      { max: 250, message: "Altura deve ser no máximo 250cm" }
    ],
    weight: [
      { required: true, message: "Peso é obrigatório" },
      { min: 30, message: "Peso deve ser pelo menos 30kg" },
      { max: 300, message: "Peso deve ser no máximo 300kg" }
    ],
    goal_weight: [
      { required: true, message: "Meta de peso é obrigatória" },
      { min: 30, message: "Meta deve ser pelo menos 30kg" },
      { max: 300, message: "Meta deve ser no máximo 300kg" }
    ],
    phone_number: [
      { required: true, message: "Telefone é obrigatório" },
      { pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: "Use o formato (11) 99999-9999" }
    ],
    gender: [
      { required: true, message: "Selecione um gênero" }
    ]
  };

  const { errors, validateField } = useFormValidation(validationSchema);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfile({ ...profile, phone_number: formatted });
    validateField('phone_number', formatted);
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile({ ...profile, [field]: value });
    validateField(field, value);
  };

  const handleSave = () => {
    // Validar todos os campos antes de salvar
    const fieldsToValidate = {
      name: profile?.name,
      age: profile?.age,
      height: profile?.height,
      weight: profile?.weight,
      goal_weight: profile?.goal_weight,
      phone_number: profile?.phone_number,
      gender: profile?.gender
    };

    let hasErrors = false;
    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      if (!validateField(field, value)) {
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      onSave();
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <span>🎯</span>
          Seu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">Nome</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={profile?.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`transition-all duration-300 ${
              errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
            }`}
          />
          {errors.name && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-200">Idade</Label>
          <Input
            type="number"
            id="age"
            placeholder="Sua idade"
            value={profile?.age?.toString() || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className={`transition-all duration-300 ${
              errors.age ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
            }`}
          />
          {errors.age && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.age}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-200">Altura (cm)</Label>
          <Input
            type="number"
            id="height"
            placeholder="Sua altura em cm"
            value={profile?.height?.toString() || ''}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
            className={`transition-all duration-300 ${
              errors.height ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
            }`}
          />
          {errors.height && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.height}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-200">Peso (kg)</Label>
          <Input
            type="number"
            id="weight"
            placeholder="Seu peso em kg"
            value={profile?.weight?.toString() || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
            className={`transition-all duration-300 ${
              errors.weight ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
            }`}
          />
          {errors.weight && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.weight}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="goal_weight" className="text-slate-700 dark:text-slate-200">Peso Desejado (kg)</Label>
          <Input
            type="number"
            id="goal_weight"
            placeholder="Seu peso desejado em kg"
            value={profile?.goal_weight?.toString() || ''}
            onChange={(e) => handleInputChange('goal_weight', parseFloat(e.target.value))}
            className={`transition-all duration-300 ${
              errors.goal_weight ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
            }`}
          />
          {errors.goal_weight && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.goal_weight}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone_number" className="text-slate-700 dark:text-slate-200">Telefone/WhatsApp</Label>
          <Input
            type="tel"
            id="phone_number"
            placeholder="(11) 99999-9999"
            value={profile?.phone_number || ''}
            onChange={handlePhoneChange}
            className={`transition-all duration-300 ${
              errors.phone_number ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
            }`}
            maxLength={15}
          />
          {errors.phone_number && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.phone_number}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="gender" className="text-slate-700 dark:text-slate-200">Gênero</Label>
          <Select 
            onValueChange={(value) => handleInputChange('gender', value)} 
            value={profile?.gender || ''}
          >
            <SelectTrigger 
              id="gender"
              className={`transition-all duration-300 ${
                errors.gender ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'focus:border-red-500'
              }`}
            >
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.gender}
            </div>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          {isSaving ? (
            <>
              <Loading size="sm" />
              <span className="ml-2">Salvando...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span className="ml-2">Salvar Perfil</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
