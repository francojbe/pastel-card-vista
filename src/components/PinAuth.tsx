
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface PinAuthProps {
  onSuccess: () => void;
}

const PinAuth: React.FC<PinAuthProps> = ({ onSuccess }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const correctPin = "22091992";

  useEffect(() => {
    // Auto-focus the input when component mounts
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
      // Re-focus the input after error
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Only allow numbers
    if (input.length <= 8) {
      setValue(input);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[350px] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#00C853] to-[#00E676] p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Ingresa tu PIN de verificación en dos pasos
          </h2>
        </CardHeader>
        <CardContent className="bg-[#1e1e1e] p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-lg p-4">
              <Input
                ref={inputRef}
                type="password"
                value={value}
                onChange={handleInputChange}
                className="tracking-[1em] text-center text-xl bg-transparent border-neutral-700 
                          focus:border-green-500 text-green-400 h-12"
                maxLength={8}
                autoComplete="off"
                placeholder="········"
              />
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-neutral-400">
                Te lo preguntaremos periódicamente para ayudarte a recordarlo.
              </p>
              <Button 
                variant="link" 
                type="button" 
                className="text-[#00C853] hover:text-[#00E676] transition-colors"
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
