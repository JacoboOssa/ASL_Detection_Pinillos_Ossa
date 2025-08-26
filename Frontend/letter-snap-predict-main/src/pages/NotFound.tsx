import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Página no encontrada</h2>
            <p className="text-muted-foreground">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-primary hover:bg-primary/90 shadow-glow"
        >
          <Home className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
