
import { useState, useRef, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FoodAnalysisResult from './FoodAnalysisResult';
import { analyzeFoodImage, saveFoodAnalysis, FoodAnalysis } from '@/lib/food';

interface PhotoAnalyzerProps {
  onAnalysisComplete?: (analysis: any) => void;
}

const PhotoAnalyzer = memo(({ onAnalysisComplete }: PhotoAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
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
        setSelectedImage(result);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    
    try {
      const result = await analyzeFoodImage(selectedImage);
      setAnalysis(result);
      
      const saveResult = await saveFoodAnalysis(result, selectedImage);
      if (saveResult.success) {
        toast({
          title: "✅ Análise Concluída!",
          description: "Análise salva no histórico com sucesso.",
        });
        
        if (onAnalysisComplete) {
          onAnalysisComplete({ ...result, id: saveResult.id });
        }
      }
    } catch (error: any) {
      toast({
        title: "❌ Erro na Análise",
        description: `Erro: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  }, [selectedImage, onAnalysisComplete, toast]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-600">
            <Camera className="w-5 h-5 text-blue-600" />
            Análise IA de Alimentos
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
                </div>
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-32 border-2 border-dashed border-blue-300"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <span className="text-lg font-semibold">Enviar Foto</span>
                </div>
              </Button>
            </div>
          ) : (
            !analysis && (
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
                
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Analisar com IA
                    </>
                  )}
                </Button>
              </div>
            )
          )}

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
        <FoodAnalysisResult analysis={analysis} />
      )}
    </div>
  );
});

PhotoAnalyzer.displayName = 'PhotoAnalyzer';

export default PhotoAnalyzer;
