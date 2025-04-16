
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import MonthSelector from './MonthSelector';

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
  return (
    <div className="card-dashboard bg-gradient-to-r from-blue-pastel to-blue-pastel/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-600">Total Gastado</h2>
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
      </div>
      
      {isLoading ? (
        <div className="h-16 flex items-center">
          <div className="animate-pulse h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="font-display font-bold text-4xl text-blue-light">
          {formatCurrency(total)}
        </div>
      )}
    </div>
  );
};

export default MonthlyTotal;
