
import React, { useState, useCallback, memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { analyzeFood } from "@/lib/food/analysis";
import { saveAnalysisToHistory } from "@/lib/food/history";
import { useLogger } from '@/utils/logger';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';
import FoodAnalysisResult from "./FoodAnalysisResult";

interface PhotoAnalyzerProps {
  onAnalysisComplete?: (result: any) => void;
}

const PhotoAnalyzer = memo(({ onAnalysisComplete }: PhotoAnalyzerProps) => {
  const logger = useLogger('PhotoAnalyzer');
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Memoized file validation
  const validateFile = useCallback((file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Por favor, selecione uma imagem JPEG, PNG ou WebP",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 10MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [toast]);

  // Memoized file handler
  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    logger.info('File selected for analysis', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Cleanup previous URL
    return () => URL.revokeObjectURL(url);
  }, [validateFile, logger]);

  // File input change handler
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Camera capture handler
  const handleCameraCapture = useCallback(async () => {
    try {
      logger.info('Attempting to access camera');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element for camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // For now, we'll use file input as fallback
      // In a real implementation, you'd create a camera interface
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          handleFileSelect(file);
        }
        stream.getTracks().forEach(track => track.stop());
      };
      input.click();

    } catch (error) {
      logger.error('Camera access failed', { error });
      toast({
        title: "Câmera não disponível",
        description: "Use o botão de upload para selecionar uma imagem",
        variant: "destructive"
      });
    }
  }, [handleFileSelect, toast, logger]);

  // Analysis handler
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhuma imagem selecionada",
        description: "Por favor, selecione uma imagem para análise",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    logger.info('Starting food analysis', { fileName: selectedFile.name });

    try {
      const result = await analyzeFood(selectedFile);
      
      if (result) {
        logger.info('Analysis completed successfully', { 
          foodName: result.name,
          calories: result.nutrition?.calories 
        });

        setAnalysisResult(result);
        
        // Save to history
        await saveAnalysisToHistory(result);
        
        onAnalysisComplete?.(result);

        toast({
          title: "Análise concluída!",
          description: `Identificamos: ${result.name}`,
        });
      } else {
        throw new Error('Análise retornou resultado vazio');
      }

    } catch (error) {
      logger.error('Analysis failed', { error });
      
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, onAnalysisComplete, toast, logger]);

  // Reset handler
  const handleReset = useCallback(() => {
    logger.info('Resetting photo analyzer');
    
    setSelectedFile(null);
    setAnalysisResult(null);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl, logger]);

  // Memoized button states
  const buttonStates = useMemo(() => ({
    canAnalyze: selectedFile && !isAnalyzing,
    showReset: selectedFile || analysisResult,
    analyzeText: isAnalyzing ? 'Analisando...' : 'Analisar Alimento'
  }), [selectedFile, isAnalyzing, analysisResult]);

  // Show analysis result if available
  if (analysisResult) {
    return (
      <GlobalErrorBoundary level="component" name="Photo Analyzer Results">
        <FoodAnalysisResult 
          result={analysisResult} 
          onReset={handleReset}
        />
      </GlobalErrorBoundary>
    );
  }

  return (
    <GlobalErrorBoundary level="component" name="Photo Analyzer">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Análise de Alimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              {selectedFile && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {selectedFile.name}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleCameraCapture}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <Camera className="w-4 h-4" />
              Câmera
            </Button>
            
            <label className="cursor-pointer">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={isAnalyzing}
                asChild
              >
                <span>
                  <Upload className="w-4 h-4" />
                  Upload
                </span>
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                disabled={isAnalyzing}
              />
            </label>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!buttonStates.canAnalyze}
            className="w-full"
          >
            {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {buttonStates.analyzeText}
          </Button>

          {buttonStates.showReset && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
              disabled={isAnalyzing}
            >
              Nova Análise
            </Button>
          )}

          {!selectedFile && (
            <div className="text-center text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mx-auto mb-2" />
              Tire uma foto ou selecione uma imagem do seu alimento
            </div>
          )}
        </CardContent>
      </Card>
    </GlobalErrorBoundary>
  );
});

PhotoAnalyzer.displayName = 'PhotoAnalyzer';

export default PhotoAnalyzer;
