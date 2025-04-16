
import React from 'react';
import { LineChart } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
        <LineChart className="text-white" size={20} />
      </div>
      <div>
        <h1 className="font-display font-semibold text-xl">ClariFi</h1>
        <p className="text-xs text-gray-500 -mt-1">Control Financiero</p>
      </div>
    </div>
  );
};

export default Logo;
