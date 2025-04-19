
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PinAuthProps {
  onSuccess: () => void;
}

const PinAuth: React.FC<PinAuthProps> = ({ onSuccess }) => {
  const [value, setValue] = useState("");
  const correctPin = "22091992";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value === correctPin) {
      onSuccess();
      toast.success("PIN correcto");
    } else {
      toast.error("PIN incorrecto");
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Ingrese su PIN</h2>
          <p className="text-sm text-muted-foreground">
            Ingrese el PIN para acceder a la aplicación
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ingrese su PIN"
              maxLength={8}
              className="text-center text-lg"
            />
            <Button type="submit" className="w-full">
              Verificar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinAuth;
