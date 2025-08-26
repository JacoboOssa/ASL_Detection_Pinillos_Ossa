import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PredictionResponse } from '@/types/prediction';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  result: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card className="p-8 bg-gradient-card shadow-card border-border/50">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Analizando imagen...
            </h3>
            <p className="text-muted-foreground text-sm">
              Reconociendo la letra del alfabeto
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-gradient-card shadow-card border-destructive/50">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Error en el análisis
            </h3>
            <p className="text-muted-foreground text-sm">
              {error}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (result) {
    const confidencePercentage = Math.round(result.confidence * 100);
    const isHighConfidence = result.confidence >= 0.7;
    
    return (
      <Card className="p-8 bg-gradient-card shadow-card border-success/50">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Letra Detectada
              </h3>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary text-primary-foreground text-4xl font-bold shadow-glow">
                {result.prediction.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-foreground">
                La letra del alfabeto detectada es:{" "}
                <span className="font-bold text-primary text-xl">
                  {result.prediction.toUpperCase()}
                </span>
              </p>
              
              <div className="flex items-center justify-center gap-2">
                <span className="text-muted-foreground">Probabilidad:</span>
                <Badge
                  variant={isHighConfidence ? "default" : "secondary"}
                  className={cn(
                    "text-sm font-semibold px-3 py-1",
                    isHighConfidence 
                      ? "bg-success text-success-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {confidencePercentage}%
                </Badge>
              </div>
              
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000 ease-out",
                    isHighConfidence ? "bg-success" : "bg-primary"
                  )}
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
};