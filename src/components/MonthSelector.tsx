
import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { getMonthOptions } from '../utils/formatters';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const monthOptions = getMonthOptions();
  
  // Encuentra la etiqueta para el mes seleccionado
  const selectedLabel = monthOptions.find(option => option.value === selectedMonth)?.label || '';

  return (
    <div className="relative inline-block">
      <button 
        className="pill-button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <Calendar size={16} className="text-blue-light" />
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-10 mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-48 max-h-60 overflow-auto animate-fade-in"
        >
          {monthOptions.map((option) => (
            <div 
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${option.value === selectedMonth ? 'bg-blue-50 font-medium text-blue-light' : ''}`}
              onClick={() => {
                onMonthChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthSelector;
