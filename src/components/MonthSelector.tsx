import React from 'react';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange }) => {
  const periods = [
    { label: 'Semana', value: 'week' },
    { label: 'Mes', value: 'month' },
    { label: 'Año', value: 'year' },
    { label: 'Todo', value: 'all' },
  ];

  return (
    <div className="w-full bg-[#F1F5F9] p-1 rounded-2xl flex items-center shadow-inner">
      {periods.map((period) => (
        <button 
          key={period.value}
          onClick={() => onMonthChange(period.value)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
            period.value === selectedMonth 
            ? 'bg-white text-[#2563FF] shadow-sm' 
            : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default MonthSelector;
