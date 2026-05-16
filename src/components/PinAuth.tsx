
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PinAuthProps {
  onSuccess: () => void;
}

const DEFAULT_PIN = "22091992";
const PIN_KEY = "clarifi_pin";

export const getStoredPin = () => localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
export const setStoredPin = (pin: string) => localStorage.setItem(PIN_KEY, pin);

const PinAuth: React.FC<PinAuthProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const pinLength = 8;

  const correctPin = getStoredPin();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setPin(prev => prev.slice(0, -1));
        setIsError(false);
      } else if (/^\d$/.test(e.key) && pin.length < pinLength) {
        setPin(prev => prev + e.key);
        setIsError(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  useEffect(() => {
    if (pin.length === pinLength) {
      if (pin === correctPin) {
        onSuccess();
        toast.success("Acceso concedido");
      } else {
        setIsError(true);
        toast.error("PIN incorrecto");
        setTimeout(() => setPin(""), 500);
      }
    }
  }, [pin, onSuccess]);

  return (
    <div className="fixed inset-0 bg-[#F5F7FB] z-[100] flex flex-col items-center justify-center p-6">
      <div className="max-w-xs w-full flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 w-20 h-20 rounded-[24px] bg-[#2563FF] flex items-center justify-center shadow-neo-button"
        >
          <Lock className="text-white" size={32} />
        </motion.div>

        <h1 className="text-[24px] font-bold text-[#0F172A] mb-2 text-center tracking-tight">Seguridad ClariFi</h1>
        <p className="text-[#64748B] text-sm mb-12 text-center font-medium">Ingresa tu código de 8 dígitos para desbloquear tu dashboard financiero.</p>

        <motion.div 
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-3 mb-16"
        >
          {Array.from({ length: pinLength }).map((_, i) => (
            <div 
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                i < pin.length 
                  ? 'bg-[#2563FF] border-[#2563FF] scale-110' 
                  : isError ? 'border-[#FF5A5F] bg-[#FF5A5F]/10' : 'border-[#E5EAF2] bg-transparent'
              }`}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-[280px] mb-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((num, i) => (
            <button
              key={i}
              onClick={() => {
                if (num === "⌫") {
                  setPin(prev => prev.slice(0, -1));
                } else if (typeof num === "number" && pin.length < pinLength) {
                  setPin(prev => prev + num);
                }
              }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${
                num === "" 
                  ? "pointer-events-none opacity-0" 
                  : "bg-white text-[#0F172A] active:scale-90 hover:bg-[#F9FAFC] shadow-sm border border-[#E5EAF2]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button 
          className="text-[#2563FF] font-bold text-sm hover:underline"
          onClick={() => toast.error("Función no disponible")}
        >
          ¿Olvidaste tu PIN?
        </button>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 text-[#94A3B8]">
        <ShieldCheck size={16} />
        <span className="text-[10px] uppercase font-bold tracking-[2px]">Encriptación Bancaria</span>
      </div>
    </div>
  );
};

export default PinAuth;
