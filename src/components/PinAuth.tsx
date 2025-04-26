
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Asterisk } from 'lucide-react';

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
      <Card className="w-[350px] bg-[#1e293b]/90 border-neutral-700">
        <CardHeader className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-400">
            Ingresa tu PIN de verificación en dos pasos
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-lg border border-neutral-700 p-4">
              <InputOTP
                value={value}
                onChange={setValue}
                maxLength={8}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2 justify-center">
                    {slots.map((slot, i) => (
                      <InputOTPSlot key={i} {...slot}>
                        <Asterisk className="text-green-400" />
                      </InputOTPSlot>
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-neutral-400">
                Te lo preguntaremos periódicamente para ayudarte a recordarlo.
              </p>
              <Button variant="link" type="button" className="text-green-400 hover:text-green-500">
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
