export interface PredictionResponse {
  prediction: string;
  confidence: number;
}

export interface PredictionState {
  isLoading: boolean;
  result: PredictionResponse | null;
  error: string | null;
}