
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FoodAnalysisResult from './FoodAnalysisResult';
import { analyzeFoodImage, saveFoodAnalysis } from '@/lib/foodAnalysis';

interface PhotoAnalyzerProps {
  onAnalysisComplete?: (analysis: any) => void;
}

const PhotoAnalyzer = ({ onAnalysisComplete }: PhotoAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name, 'Tamanho:', file.size);
      
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
        console.log('Imagem carregada com sucesso');
        setSelectedImage(result);
        setAnalysis(null);
      };
      reader.onerror = (e) => {
        console.error('Erro ao ler arquivo:', e);
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
      console.log('Nenhuma imagem selecionada');
      return;
    }

    console.log('Iniciando análise...');
    setAnalyzing(true);
    
    try {
      const result = await analyzeFoodImage(selectedImage);
      console.log('Análise concluída:', result);
      
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

      toast({
        title: "✅ Análise Concluída!",
        description: `Encontrados ${result.foods.length} alimentos com ${result.totalCalories} calorias totais!`,
      });
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    console.log('Resetando análise');
    setSelectedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSaveAnalysis = async (analysisData: any) => {
    console.log('Salvando análise:', analysisData);
    
    try {
      const saved = await saveFoodAnalysis(analysisData, selectedImage);
      if (saved) {
        toast({
          title: "✅ Análise Salva!",
          description: "A análise foi salva no seu histórico.",
        });
        
        if (onAnalysisComplete) {
          onAnalysisComplete(saved);
        }
      } else {
        toast({
          title: "⚠️ Análise não salva",
          description: "Houve um problema ao salvar, mas a análise ainda está disponível.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar a análise.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Analisar Foto de Alimento
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
                className="h-32 border-2 border-dashed border-blue-300 hover:border-blue-500"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-900">Enviar Foto</span>
                  <span className="text-sm text-gray-600">Escolher da galeria</span>
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
                      Analisar Calorias
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
          onSave={handleSaveAnalysis}
        />
      )}
    </div>
  );
};

export default PhotoAnalyzer;
