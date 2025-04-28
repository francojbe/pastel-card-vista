import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface PinAuthProps {
  onSuccess: () => void;
}

const PinAuth: React.FC<PinAuthProps> = ({
  onSuccess
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const correctPin = "22091992";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === correctPin) {
      onSuccess();
      toast.success("PIN correcto");
    } else {
      toast.error("PIN incorrecto");
      setValue("");
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 8) {
      setValue(input);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[350px] overflow-hidden border-accent shadow-lg">
        <CardHeader className="bg-gradient-to-r from-accent to-accent/80 p-6">
          <h2 className="font-bold text-accent-foreground text-center text-lg my-0 py-0 px-0 mx-0">
            Ingresa tu PIN de verificación
          </h2>
        </CardHeader>
        <CardContent className="p-6 space-y-8 bg-card my-0">
          <form onSubmit={handleSubmit} className="space-y-8 py-0 px-0">
            <div className="rounded-lg p-4">
              <Input 
                ref={inputRef}
                type="password"
                value={value}
                onChange={handleInputChange}
                className="tracking-[1em] text-center text-xl bg-transparent border-accent/20 
                          focus:border-accent text-accent h-12"
                maxLength={8}
                autoComplete="off"
                placeholder="········"
              />
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Te lo preguntaremos periódicamente para ayudarte a recordarlo.
              </p>
              <Button 
                variant="link" 
                className="text-accent hover:text-accent/80"
                onClick={() => toast.error("Función no disponible")}
              >
                ¿Olvidaste tu PIN?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinAuth;
