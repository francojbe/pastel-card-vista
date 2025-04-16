
import React from 'react';
import { CreditCard } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center">
        <CreditCard className="text-white" size={24} />
      </div>
      <div>
        <h1 className="font-display font-semibold text-xl">CardVista</h1>
        <p className="text-xs text-gray-500 -mt-1">Control de Gastos</p>
      </div>
    </div>
  );
};

export default Logo;
