
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Scale, Ruler, Calendar, User, ArrowRight, Target, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const insertData: any = {
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

      const { error } = await supabase
        .from('user_profiles')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Perfil criado com sucesso!",
        description: "Agora você pode começar sua jornada de emagrecimento.",
      });

      onComplete();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar perfil",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== "";
      case 2: return formData.gender !== "";
      case 3: return formData.weight !== "" && parseFloat(formData.weight) > 0;
      case 4: return formData.height !== "" && parseFloat(formData.height) > 0;
      case 5: return formData.age !== "" && parseInt(formData.age) > 0;
      case 6: return formData.goalWeight !== "" && parseFloat(formData.goalWeight) > 0;
      case 7: return formData.phoneNumber.trim() !== "";
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl py-6"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é o seu sexo?</h2>
              <p className="text-gray-300">Essa informação nos ajuda a personalizar seu plano</p>
            </div>
            
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-red-500 transition-colors">
                <RadioGroupItem value="masculino" id="masculino" />
                <Label htmlFor="masculino" className="text-white cursor-pointer flex-1">Masculino</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-red-500 transition-colors">
                <RadioGroupItem value="feminino" id="feminino" />
                <Label htmlFor="feminino" className="text-white cursor-pointer flex-1">Feminino</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-600 hover:border-red-500 transition-colors">
                <RadioGroupItem value="outro" id="outro" />
                <Label htmlFor="outro" className="text-white cursor-pointer flex-1">Prefiro não informar</Label>
              </div>
            </RadioGroup>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Scale className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl py-6"
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Ruler className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl py-6"
              />
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl py-6"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl py-6"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Qual é seu telefone?</h2>
              <p className="text-gray-300">Para entrarmos em contato sobre ofertas especiais</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">Número do WhatsApp</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Ex: (11) 99999-9999"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl py-6"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/95 backdrop-blur-sm shadow-2xl border-red-500">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
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
                className={`w-2 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-red-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 border-gray-600 text-white hover:bg-gray-700"
              >
                Voltar
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
            >
              {isLoading ? (
                "Salvando..."
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
