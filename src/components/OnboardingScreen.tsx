import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Scale, Ruler, Calendar, User, ArrowRight, Target, Phone, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Loading } from "@/components/ui/loading";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    weight: "",
    height: "",
    age: "",
    goalWeight: "",
    phoneNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validationSchema = {
    name: [
      { required: true, message: "Nome é obrigatório" },
      { minLength: 2, message: "Nome deve ter pelo menos 2 caracteres" },
      { maxLength: 50, message: "Nome deve ter no máximo 50 caracteres" }
    ],
    gender: [
      { required: true, message: "Selecione um gênero" }
    ],
    weight: [
      { required: true, message: "Peso é obrigatório" },
      { min: 30, message: "Peso deve ser pelo menos 30kg" },
      { max: 300, message: "Peso deve ser no máximo 300kg" }
    ],
    height: [
      { required: true, message: "Altura é obrigatória" },
      { min: 100, message: "Altura deve ser pelo menos 100cm" },
      { max: 250, message: "Altura deve ser no máximo 250cm" }
    ],
    age: [
      { required: true, message: "Idade é obrigatória" },
      { min: 13, message: "Idade deve ser pelo menos 13 anos" },
      { max: 120, message: "Idade deve ser no máximo 120 anos" }
    ],
    goalWeight: [
      { required: true, message: "Meta de peso é obrigatória" },
      { min: 30, message: "Meta deve ser pelo menos 30kg" },
      { max: 300, message: "Meta deve ser no máximo 300kg" }
    ],
    phoneNumber: [
      { required: true, message: "Telefone é obrigatório" },
      { pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: "Use o formato (11) 99999-9999" }
    ]
  };

  const { errors, validateField } = useFormValidation(validationSchema);

  const handleNext = () => {
    const currentFieldName = getCurrentFieldName();
    const currentValue = getCurrentFieldValue();
    
    if (currentFieldName && !validateField(currentFieldName, currentValue)) {
      return;
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const getCurrentFieldName = () => {
    switch (currentStep) {
      case 1: return 'name';
      case 2: return 'gender';
      case 3: return 'weight';
      case 4: return 'height';
      case 5: return 'age';
      case 6: return 'goalWeight';
      case 7: return 'phoneNumber';
      default: return null;
    }
  };

  const getCurrentFieldValue = () => {
    switch (currentStep) {
      case 1: return formData.name;
      case 2: return formData.gender;
      case 3: return formData.weight;
      case 4: return formData.height;
      case 5: return formData.age;
      case 6: return formData.goalWeight;
      case 7: return formData.phoneNumber;
      default: return '';
    }
  };

  const handleSubmit = async () => {
    // Validar todos os campos antes de enviar
    const fieldsToValidate = {
      name: formData.name,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.height,
      age: formData.age,
      goalWeight: formData.goalWeight,
      phoneNumber: formData.phoneNumber
    };

    let hasErrors = false;
    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      if (!validateField(field, value)) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      toast({
        title: "❌ Dados inválidos",
        description: "Por favor, verifique os campos e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      console.log('=== ONBOARDING DEBUG ===');
      console.log('User ID:', user.id);
      console.log('Form data:', formData);

      // Verificar se já existe um perfil
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id, user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Existing profile:', existingProfile);

      const profileData = {
        user_id: user.id,
        name: formData.name,
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age),
        goal_weight: parseFloat(formData.goalWeight),
        phone_number: formData.phoneNumber,
        onboarding_completed: true
      };

      console.log('Profile data to save:', profileData);

      if (existingProfile) {
        // Atualizar perfil existente
        const { error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao atualizar perfil:', error);
          throw error;
        }
      } else {
        // Criar novo perfil
        const { error } = await supabase
          .from('user_profiles')
          .insert(profileData);

        if (error) {
          console.error('Erro ao criar perfil:', error);
          throw error;
        }
      }

      toast({
        title: "✅ Perfil criado com sucesso!",
        description: "Bem-vindo ao SB2 Coach! Sua jornada começa agora.",
      });

      onComplete();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "❌ Erro ao salvar perfil",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setFormData({ ...formData, phoneNumber: formatted });
  };

  const renderStep = () => {
    const currentFieldName = getCurrentFieldName();
    const hasError = currentFieldName && errors[currentFieldName];

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <User className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Como gostaria de ser chamado(a)?</h2>
              <p className="text-gray-300">Queremos personalizar sua experiência</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Seu nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Paulo, Maria, João..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  hasError ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {hasError && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é o seu sexo?</h2>
              <p className="text-gray-300">Essa informação nos ajuda a personalizar seu plano</p>
            </div>
            
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className="space-y-4"
            >
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                formData.gender === 'masculino' ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-red-400'
              }`}>
                <RadioGroupItem value="masculino" id="masculino" />
                <Label htmlFor="masculino" className="text-white cursor-pointer flex-1">Masculino</Label>
              </div>
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                formData.gender === 'feminino' ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-red-400'
              }`}>
                <RadioGroupItem value="feminino" id="feminino" />
                <Label htmlFor="feminino" className="text-white cursor-pointer flex-1">Feminino</Label>
              </div>
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                formData.gender === 'outro' ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-red-400'
              }`}>
                <RadioGroupItem value="outro" id="outro" />
                <Label htmlFor="outro" className="text-white cursor-pointer flex-1">Prefiro não informar</Label>
              </div>
            </RadioGroup>
            {hasError && (
              <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.gender}
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Scale className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é o seu peso atual?</h2>
              <p className="text-gray-300">Digite seu peso em quilogramas</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-white">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  hasError ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {hasError && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {errors.weight}
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Ruler className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é a sua altura?</h2>
              <p className="text-gray-300">Digite sua altura em centímetros</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height" className="text-white">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="Ex: 175"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  hasError ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {hasError && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {errors.height}
                </div>
              )}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é a sua idade?</h2>
              <p className="text-gray-300">Essa informação nos ajuda a calcular suas necessidades</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">Idade (anos)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  hasError ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {hasError && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {errors.age}
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Target className="w-16 h-16 text-red-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é seu peso desejado?</h2>
              <p className="text-gray-300">Digite o peso que você quer alcançar</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goalWeight" className="text-white">Meta de Peso (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.1"
                placeholder="Ex: 65.0"
                value={formData.goalWeight}
                onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  hasError ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {hasError && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {errors.goalWeight}
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Phone className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é seu telefone?</h2>
              <p className="text-gray-300">Para entrarmos em contato sobre ofertas especiais</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">Número do WhatsApp</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  hasError ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
                maxLength={15}
              />
              {hasError && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phoneNumber}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm shadow-2xl border-red-500 transition-all duration-500 hover:shadow-red-500/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/bf6fca4b-d2fa-4dfb-9422-75f0f01befa7.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-white">
            Vamos conhecer você melhor
          </CardTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Passo {currentStep} de 7
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 border-gray-600 text-white hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                Voltar
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
            >
              {isLoading ? (
                <Loading size="sm" />
              ) : currentStep === 7 ? (
                "Finalizar"
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
