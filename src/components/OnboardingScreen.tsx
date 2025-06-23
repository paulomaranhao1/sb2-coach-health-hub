import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingValidation } from "@/hooks/useOnboardingValidation";
import { Loading } from "@/components/ui/loading";
import OnboardingProgressIndicator from "@/components/onboarding/OnboardingProgressIndicator";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import { formatPhoneNumber } from "@/utils/phoneFormatter";
import { getCurrentFieldName, getCurrentFieldValue } from "@/utils/onboardingHelpers";
interface OnboardingScreenProps {
  onComplete: () => void;
}
const OnboardingScreen = ({
  onComplete
}: OnboardingScreenProps) => {
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
  const {
    toast
  } = useToast();
  const {
    errors,
    validateField
  } = useOnboardingValidation();
  const handleNext = () => {
    const currentFieldName = getCurrentFieldName(currentStep);
    const currentValue = getCurrentFieldValue(currentStep, formData);
    if (currentFieldName && !validateField(currentFieldName, currentValue)) {
      return;
    }
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
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
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      console.log('=== ONBOARDING DEBUG ===');
      console.log('User ID:', user.id);
      console.log('Form data:', formData);

      // Verificar se já existe um perfil
      const {
        data: existingProfile,
        error: checkError
      } = await supabase.from('user_profiles').select('id, user_id').eq('user_id', user.id).maybeSingle();
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
        const {
          error
        } = await supabase.from('user_profiles').update(profileData).eq('user_id', user.id);
        if (error) {
          console.error('Erro ao atualizar perfil:', error);
          throw error;
        }
      } else {
        // Criar novo perfil
        const {
          error
        } = await supabase.from('user_profiles').insert(profileData);
        if (error) {
          console.error('Erro ao criar perfil:', error);
          throw error;
        }
      }
      toast({
        title: "✅ Perfil criado com sucesso!",
        description: "Bem-vindo ao SB2 Coach! Sua jornada começa agora."
      });
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "❌ Erro ao salvar perfil",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      phoneNumber: formatted
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm shadow-2xl border-red-500 transition-all duration-500 hover:shadow-red-500/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <img src="/lovable-uploads/bf6fca4b-d2fa-4dfb-9422-75f0f01befa7.png" alt="SB2 Coach Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-slate-50">
            Vamos conhecer você melhor
          </CardTitle>
          <OnboardingProgressIndicator currentStep={currentStep} totalSteps={7} />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <OnboardingStep step={currentStep} formData={formData} onFormDataChange={setFormData} errors={errors} onPhoneChange={handlePhoneChange} />
          
          <div className="flex space-x-3">
            {currentStep > 1 && <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 border-gray-600 text-white hover:bg-gray-700 transition-all duration-300 hover:scale-105" disabled={isLoading}>
                Voltar
              </Button>}
            
            <Button onClick={handleNext} disabled={isLoading} className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30">
              {isLoading ? <Loading size="sm" /> : currentStep === 7 ? "Finalizar" : <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default OnboardingScreen;