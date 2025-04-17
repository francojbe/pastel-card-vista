import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Expense } from '../types/expense';
import { CreditCard, Filter } from 'lucide-react';
import ExpenseIcon from './ExpenseIcon';
import { useAmountVisibility } from '../contexts/AmountVisibilityContext';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, isLoading }) => {
  const { isAmountVisible } = useAmountVisibility();

  if (isLoading) {
    return (
      <div className="glass-card min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-light"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="glass-card min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400 text-lg">No hay gastos registrados en este mes</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-light/10 flex items-center justify-center">
            <CreditCard className="text-blue-light" size={20} />
          </div>
          <h2 className="text-xl font-display font-semibold">Transacciones</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">{expenses.length} transacciones</p>
          <button className="pill-button flex items-center gap-1 py-1.5 px-3">
            <Filter size={14} />
            <span>Filtrar</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {expenses.map((expense, index) => (
          <div 
            key={`${expense.fecha}-${index}`} 
            className="transaction-card animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <ExpenseIcon commerceName={expense.comercio} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{expense.comercio}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="text-blue-light">{formatDate(expense.fecha)}</span>
                      <span>{expense.hora}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {isAmountVisible ? formatCurrency(expense.monto) : '••••••'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <CreditCard size={12} />
                      <span>****{expense.tarjeta}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTable;
