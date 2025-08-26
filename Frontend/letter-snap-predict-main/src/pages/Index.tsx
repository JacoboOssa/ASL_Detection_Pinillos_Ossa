import React, { useState } from 'react';
import { CameraCapture } from '@/components/CameraCapture';
import { ResultDisplay } from '@/components/ResultDisplay';
import { predictLetter } from '@/utils/api';
import { PredictionState } from '@/types/prediction';
import { useToast } from '@/hooks/use-toast';
import { Hand, Sparkles } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

const Index = () => {
  const [predictionState, setPredictionState] = useState<PredictionState>({
    isLoading: false,
    result: null,
    error: null,
  });
  
  const { toast } = useToast();

  const handleImageCapture = async (file: File) => {
    setPredictionState({
      isLoading: true,
      result: null,
      error: null,
    });

    try {
      const result = await predictLetter(file);
      
      setPredictionState({
        isLoading: false,
        result,
        error: null,
      });

      toast({
        title: "¡Análisis completado!",
        description: `Letra detectada: ${result.prediction.toUpperCase()} (${Math.round(result.confidence * 100)}% de confianza)`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setPredictionState({
        isLoading: false,
        result: null,
        error: errorMessage,
      });

      toast({
        title: "Error al analizar la imagen",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                <Hand className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Reconocimiento de Lenguaje de Señas</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Detector de{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Letras
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Captura una foto de una letra hecha con las manos y descubre qué letra del alfabeto es usando inteligencia artificial
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Camera Capture Section */}
          <CameraCapture
            onImageCapture={handleImageCapture}
            isLoading={predictionState.isLoading}
          />

          {/* Results Section */}
          {(predictionState.isLoading || predictionState.result || predictionState.error) && (
            <ResultDisplay
              result={predictionState.result}
              isLoading={predictionState.isLoading}
              error={predictionState.error}
            />
          )}

          {/* Instructions */}
          {!predictionState.result && !predictionState.isLoading && !predictionState.error && (
            <div className="text-center space-y-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p>Posiciona tu mano formando una letra</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p>Toma una foto clara y bien iluminada</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <p>Obtén el resultado instantáneamente</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;