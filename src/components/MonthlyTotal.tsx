
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import MonthSelector from './MonthSelector';
import { Wallet } from 'lucide-react';
import { useAmountVisibility } from '../contexts/AmountVisibilityContext';

interface MonthlyTotalProps {
  total: number;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  isLoading: boolean;
}

const MonthlyTotal: React.FC<MonthlyTotalProps> = ({ 
  total, 
  selectedMonth, 
  onMonthChange,
  isLoading 
}) => {
  const { isAmountVisible } = useAmountVisibility();

  return (
    <div className="glass-card bg-gradient-to-r from-blue-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-light/10 flex items-center justify-center">
            <Wallet className="text-blue-light" size={24} />
          </div>
          <h2 className="text-lg font-medium text-gray-700">Total del Mes</h2>
        </div>
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
      </div>
      
      {isLoading ? (
        <div className="h-16 flex items-center">
          <div className="animate-pulse h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="font-display font-bold text-4xl text-blue-light animate-fade-in">
          {isAmountVisible ? formatCurrency(total) : '••••••'}
        </div>
      )}
    </div>
  );
};

export default MonthlyTotal;
