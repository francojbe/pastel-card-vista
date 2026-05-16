
import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Expense } from '../types/expense';
import { CreditCard, History, Filter, Calendar, Clock, MapPin, Tag, ChevronRight, Share2, Info } from 'lucide-react';
import ExpenseIcon from './ExpenseIcon';
import { useAmountVisibility } from '../contexts/AmountVisibilityContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  showViewAll?: boolean;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, isLoading, showViewAll = true }) => {
  const { isAmountVisible } = useAmountVisibility();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  if (isLoading) {
    return (
      <div className="neo-card min-h-[400px] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#2563FF]/20 border-t-[#2563FF] animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="neo-card flex flex-col min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="expense-icon">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-[#0F172A] font-bold text-lg">Transacciones</h2>
              <p className="text-[#64748B] text-xs font-medium">Historial reciente</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-[#2563FF] font-bold text-sm bg-[#EAF1FF] px-4 py-2 rounded-full transition-all hover:bg-[#D6E4FF]">
            <Filter size={14} />
            Filtrar
          </button>
        </div>
        
        <div className="flex-1 space-y-3">
          {expenses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] gap-3 py-20">
              <CreditCard size={48} className="opacity-20" />
              <p className="text-sm font-medium">No hay registros este mes</p>
            </div>
          ) : (
            expenses.map((expense, index) => (
              <div 
                key={`${expense.fecha}-${index}`} 
                onClick={() => setSelectedExpense(expense)}
                className="flex items-center gap-4 p-3 h-[72px] rounded-2xl transition-all duration-200 hover:bg-[#F9FAFC] group cursor-pointer"
              >
                <div className="shrink-0">
                  <ExpenseIcon commerceName={expense.comercio} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#0F172A] truncate text-[15px]">{expense.comercio}</h3>
                      <div className="text-[12px] text-[#94A3B8] mt-0.5 font-medium">
                        {formatDate(expense.fecha)} • {expense.hora}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0F172A] text-[15px]">
                        {isAmountVisible ? formatCurrency(expense.monto) : '••••••'}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5 font-bold uppercase tracking-wider">
                        Visa • {expense.tarjeta}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {showViewAll && (
          <button className="w-full mt-6 py-4 text-[#2563FF] font-bold text-sm border-t border-[#EEF2F7] hover:bg-[#F9FAFC] transition-colors rounded-b-3xl">
            Ver todo el historial
          </button>
        )}
      </div>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-md p-0 rounded-[32px] overflow-hidden border-none shadow-2xl bg-[#F8FAFC]">
          {selectedExpense && (
            <div className="flex flex-col">
              {/* Top Banner / Header */}
              <div className="bg-white p-8 pb-10 flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4 shadow-sm border border-[#E2E8F0]">
                  <ExpenseIcon commerceName={selectedExpense.comercio} />
                </div>
                <h2 className="text-2xl font-bold text-[#0F172A]">{selectedExpense.comercio}</h2>
                <p className="text-sm text-[#64748B] font-medium mt-1">{formatDate(selectedExpense.fecha)} • {selectedExpense.hora}</p>
                
                <div className="mt-8">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-1">Monto de la transacción</span>
                  <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight">
                    {isAmountVisible ? formatCurrency(selectedExpense.monto) : '••••••••'}
                  </h1>
                </div>
              </div>

              {/* Detail Content */}
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Detalles del pago</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">
                          <CreditCard size={16} />
                        </div>
                        <span className="text-sm font-medium text-[#64748B]">Tarjeta de crédito</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A]">Visa • {selectedExpense.tarjeta}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">
                          <Tag size={16} />
                        </div>
                        <span className="text-sm font-medium text-[#64748B]">Categoría</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A] px-3 py-1 bg-[#F1F5F9] rounded-full">
                        {selectedExpense.comercio.toLowerCase().includes('uber') ? 'Transporte' : 
                         selectedExpense.comercio.toLowerCase().includes('starbucks') ? 'Comida' : 'General'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">
                          <Info size={16} />
                        </div>
                        <span className="text-sm font-medium text-[#64748B]">Estado</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#10B981]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-sm font-bold">Completado</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseTable;
