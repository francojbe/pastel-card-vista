
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getMonthOptions } from '../utils/formatters';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange }) => {
  const monthOptions = getMonthOptions();
  
  // Encuentra la etiqueta para el mes seleccionado
  const selectedLabel = monthOptions.find(option => option.value === selectedMonth)?.label || '';

  return (
    <div className="relative inline-block">
      <div 
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => document.getElementById('month-dropdown')?.classList.toggle('hidden')}
      >
        <span className="font-medium">{selectedLabel}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      
      <div 
        id="month-dropdown"
        className="absolute z-10 hidden mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-full max-h-60 overflow-auto"
      >
        {monthOptions.map((option) => (
          <div 
            key={option.value}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${option.value === selectedMonth ? 'bg-blue-pastel/50 font-medium' : ''}`}
            onClick={() => {
              onMonthChange(option.value);
              document.getElementById('month-dropdown')?.classList.add('hidden');
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthSelector;
