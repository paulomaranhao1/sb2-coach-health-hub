
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Heart, Scale, Ruler, Calendar, Target, Phone, AlertCircle } from "lucide-react";

interface OnboardingStepProps {
  step: number;
  formData: any;
  onFormDataChange: (data: any) => void;
  errors: { [key: string]: string };
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OnboardingStep = ({ step, formData, onFormDataChange, errors, onPhoneChange }: OnboardingStepProps) => {
  const getFieldError = (fieldName: string) => {
    return errors[fieldName];
  };

  const renderStep = () => {
    switch (step) {
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
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  getFieldError('name') ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {getFieldError('name') && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('name')}
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
              onValueChange={(value) => onFormDataChange({ ...formData, gender: value })}
              className="space-y-4"
            >
              {['masculino', 'feminino', 'outro'].map((gender) => (
                <div key={gender} className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  formData.gender === gender ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-red-400'
                }`}>
                  <RadioGroupItem value={gender} id={gender} />
                  <Label htmlFor={gender} className="text-white cursor-pointer flex-1">
                    {gender === 'masculino' ? 'Masculino' : gender === 'feminino' ? 'Feminino' : 'Prefiro não informar'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {getFieldError('gender') && (
              <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('gender')}
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
                onChange={(e) => onFormDataChange({ ...formData, weight: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  getFieldError('weight') ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {getFieldError('weight') && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('weight')}
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
                onChange={(e) => onFormDataChange({ ...formData, height: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  getFieldError('height') ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {getFieldError('height') && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('height')}
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
                onChange={(e) => onFormDataChange({ ...formData, age: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  getFieldError('age') ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {getFieldError('age') && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('age')}
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
                onChange={(e) => onFormDataChange({ ...formData, goalWeight: e.target.value })}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  getFieldError('goalWeight') ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
              />
              {getFieldError('goalWeight') && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('goalWeight')}
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
                onChange={onPhoneChange}
                className={`bg-gray-700 border-gray-600 text-white text-center text-2xl py-6 transition-all duration-300 ${
                  getFieldError('phoneNumber') ? 'border-red-500 bg-red-900/20' : 'focus:border-red-500'
                }`}
                maxLength={15}
              />
              {getFieldError('phoneNumber') && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError('phoneNumber')}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderStep();
};

export default OnboardingStep;
