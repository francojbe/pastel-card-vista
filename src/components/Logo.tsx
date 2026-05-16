
import React from 'react';
import { BarChart3 } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-[#2563FF] flex items-center justify-center shadow-neo">
        <BarChart3 className="text-white" size={20} />
      </div>
      <div className="flex flex-col">
        <h1 className="font-bold text-xl text-[#0F172A] tracking-[-0.5px] leading-none">
          ClariFi
        </h1>
        <p className="text-[10px] text-[#64748B] uppercase tracking-[0.5px] font-bold">Neo Bank</p>
      </div>
    </div>
  );
};

export default Logo;
