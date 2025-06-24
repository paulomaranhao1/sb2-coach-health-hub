import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, RotateCcw, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FoodAnalysisResult from './FoodAnalysisResult';
import { analyzeFoodImage, saveFoodAnalysis, FoodAnalysis } from '@/lib/food';

interface PhotoAnalyzerProps {
  onAnalysisComplete?: (analysis: any) => void;
}

const PhotoAnalyzer = ({ onAnalysisComplete }: PhotoAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'real' | 'mock' | 'quota_exceeded'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📁 Arquivo selecionado:', file.name, 'Tamanho:', file.size);
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem menor que 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('✅ Imagem carregada com sucesso');
        setSelectedImage(result);
        setAnalysis(null);
        setAnalysisStatus('idle');
      };
      reader.onerror = (e) => {
        console.error('❌ Erro ao ler arquivo:', e);
        toast({
          title: "Erro ao carregar imagem",
          description: "Não foi possível carregar a imagem selecionada.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      console.log('⚠️ Nenhuma imagem selecionada');
      return;
    }

    console.log('🔍 Iniciando análise de alimento...');
    setAnalyzing(true);
    setAnalysisStatus('idle');
    
    try {
      const result = await analyzeFoodImage(selectedImage);
      console.log('📊 Análise concluída:', {
        foods: result.foods?.length || 0,
        totalCalories: result.totalCalories,
        analysisType: result.analysisType
      });
      
      setAnalysis(result);
      
      // Determine analysis status for UI feedback
      if (result.analysisType === 'openai_real' && !result.isAnalysisUnavailable) {
        setAnalysisStatus('real');
      } else if (result.quotaExceeded) {
        setAnalysisStatus('quota_exceeded');
      } else {
        setAnalysisStatus('mock');
      }

      // Auto-save analysis
      try {
        const saveResult = await saveFoodAnalysis(result, selectedImage);
        if (saveResult.success) {
          console.log('💾 Análise salva automaticamente:', saveResult.id);
          
          if (onAnalysisComplete) {
            onAnalysisComplete({ ...result, id: saveResult.id });
          }

          // Status-specific toast messages
          if (analysisStatus === 'real') {
            toast({
              title: "✅ Análise IA Concluída!",
              description: `OpenAI identificou ${result.foods.length} alimentos com ${result.totalCalories} calorias e salvou no histórico.`,
            });
          } else if (analysisStatus === 'quota_exceeded') {
            toast({
              title: "💳 Quota Excedida - Análise Alternativa",
              description: "Quota da OpenAI temporariamente excedida. Usando análise alternativa de qualidade.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "🎭 Análise Alternativa Salva",
              description: "Serviço de IA indisponível. Análise alternativa salva no histórico.",
              variant: "destructive"
            });
          }
        }
      } catch (saveError: any) {
        console.error('❌ Erro ao salvar automaticamente:', saveError);
        
        toast({
          title: "⚠️ Erro ao Salvar",
          description: `Não foi possível salvar: ${saveError.message}`,
          variant: "destructive"
        });
      }

    } catch (error: any) {
      console.error('❌ Erro ao analisar imagem:', error);
      setAnalysisStatus('idle');
      
      toast({
        title: "❌ Erro na Análise",
        description: `Não foi possível analisar a imagem: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    console.log('🔄 Resetando análise');
    setSelectedImage(null);
    setAnalysis(null);
    setAnalysisStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Status indicator component
  const getStatusIndicator = () => {
    switch (analysisStatus) {
      case 'real':
        return (
          <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <Wifi className="w-3 h-3" />
            IA Real
          </div>
        );
      case 'quota_exceeded':
        return (
          <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Quota Excedida
          </div>
        );
      case 'mock':
        return (
          <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            <WifiOff className="w-3 h-3" />
            Alternativa
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            OpenAI Vision
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-600">
            <Camera className="w-5 h-5 text-blue-600" />
            Análise IA de Alimentos
            <div className="ml-auto">
              {getStatusIndicator()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedImage ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Camera className="w-8 h-8" />
                  <span className="text-lg font-semibold">Tirar Foto</span>
                  <span className="text-sm opacity-90">Use a câmera</span>
                </div>
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-32 border-2 border-dashed border-blue-300 hover:border-blue-500 text-slate-600"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <span className="text-lg font-semibold text-slate-600">Enviar Foto</span>
                  <span className="text-sm text-slate-500">Escolher da galeria</span>
                </div>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Foto selecionada" 
                  className="w-full max-h-96 object-cover rounded-lg shadow-lg"
                />
                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Trocar Foto
                </Button>
              </div>
              
              {!analysis && (
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Analisar com IA
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {analysis && (
        <FoodAnalysisResult 
          analysis={analysis} 
          onSave={async (analysisData: FoodAnalysis) => {
            console.log('💾 Tentando salvar análise manualmente:', analysisData);
            
            try {
              const saveResult = await saveFoodAnalysis(analysisData, selectedImage);
              if (saveResult.success) {
                toast({
                  title: "💾 Análise Salva!",
                  description: "A análise foi salva no seu histórico com sucesso.",
                });
                
                if (onAnalysisComplete) {
                  onAnalysisComplete({ ...analysisData, id: saveResult.id });
                }
              }
            } catch (error: any) {
              console.error('❌ Erro ao salvar análise manualmente:', error);
              toast({
                title: "❌ Erro ao Salvar",
                description: `Erro: ${error.message}`,
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default PhotoAnalyzer;
