
import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Expense } from '../types/expense';
import { CreditCard } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card-dashboard min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-light"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card-dashboard min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400 text-lg">No hay gastos registrados en este mes</p>
      </div>
    );
  }

  return (
    <div className="card-dashboard overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-semibold">Gastos del Mes</h2>
        <p className="text-sm text-gray-500">{expenses.length} transacciones</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 font-medium text-gray-500 text-sm">Fecha</th>
              <th className="text-left pb-2 font-medium text-gray-500 text-sm">Comercio</th>
              <th className="text-left pb-2 font-medium text-gray-500 text-sm">Tarjeta</th>
              <th className="text-right pb-2 font-medium text-gray-500 text-sm">Monto</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr 
                key={`${expense.fecha}-${index}`} 
                className="border-b border-gray-50 bg-pink-light hover:bg-pink-pastel/30 transition-colors"
              >
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{formatDate(expense.fecha)}</span>
                    <span className="text-blue-light text-xs">{expense.hora}</span>
                  </div>
                </td>
                <td className="py-3">{expense.comercio}</td>
                <td className="py-3">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-1" />
                    <span>****{expense.tarjeta}</span>
                  </div>
                </td>
                <td className="py-3 text-right font-medium">{formatCurrency(expense.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
