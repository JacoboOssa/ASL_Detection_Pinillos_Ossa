import { PredictionResponse } from '@/types/prediction';

const API_BASE_URL = 'http://localhost:8000';

export const predictLetter = async (imageFile: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }

    const result: PredictionResponse = await response.json();
    
    // Validar la respuesta
    if (!result.prediction || typeof result.confidence !== 'number') {
      throw new Error('Respuesta del servidor inválida');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que esté ejecutándose en http://localhost:8000');
      }
      throw error;
    }
    throw new Error('Error desconocido al procesar la imagen');
  }
};