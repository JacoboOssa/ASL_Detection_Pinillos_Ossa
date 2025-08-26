import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, RotateCcw, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  isLoading?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageCapture,
  isLoading = false,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input
      fileInputRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        stopCamera();
        onImageCapture(file);
      }
    }, 'image/jpeg', 0.8);
  }, [onImageCapture, stopCamera]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      onImageCapture(file);
    }
  };

  const resetCapture = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card border-border/50">
      <div className="space-y-4">
        {!capturedImage && !isCameraActive && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Capturar Letra del Alfabeto
              </h3>
              <p className="text-muted-foreground text-sm">
                Toma una foto de una letra hecha con las manos para reconocerla
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button 
                onClick={startCamera}
                className="bg-primary hover:bg-primary/90 shadow-glow"
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Usar Cámara
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                Seleccionar Archivo
              </Button>
            </div>
          </div>
        )}

        {isCameraActive && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 border-2 border-primary/30 rounded-lg pointer-events-none" />
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={capturePhoto}
                className="bg-primary hover:bg-primary/90 shadow-glow"
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capturar
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Imagen capturada"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={resetCapture}
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tomar Otra
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Card>
  );
};