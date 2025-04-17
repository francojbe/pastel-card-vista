import React, { useState, useEffect, useCallback, useRef } from 'react';
import Logo from '../components/Logo';
import MonthlyTotal from '../components/MonthlyTotal';
import WeeklyChart from '../components/WeeklyChart';
import ExpenseTable from '../components/ExpenseTable';
import { getMonthOptions } from '../utils/formatters';
import { ExpenseData } from '../types/expense';
import { toast } from 'sonner';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AmountVisibilityProvider, useAmountVisibility } from '../contexts/AmountVisibilityContext';

const DashboardContent: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(getMonthOptions()[0].value);
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    total_mes: 0,
    gastos: [],
    resumen_semanal: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isAmountVisible, toggleAmountVisibility } = useAmountVisibility();

  const fetchExpenseData = useCallback(async (month: string, showToast: boolean = false) => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch(`https://n8n.efinnovation.cl/webhook/Envio-data?mes=${month}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.status}`);
      }
      
      const data = await response.json();
      
      const validatedData: ExpenseData = {
        total_mes: data.total_mes || 0,
        gastos: Array.isArray(data.gastos) ? data.gastos : [],
        resumen_semanal: Array.isArray(data.resumen_semanal) ? data.resumen_semanal : []
      };
      
      setExpenseData(validatedData);
      
      if (showToast) {
        toast.success("Datos actualizados correctamente");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos. Intente de nuevo.");
      setExpenseData({
        total_mes: 0,
        gastos: [],
        resumen_semanal: []
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchExpenseData(selectedMonth, true);
  };

  useEffect(() => {
    fetchExpenseData(selectedMonth);
  }, [selectedMonth, fetchExpenseData]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchExpenseData(selectedMonth);
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedMonth, fetchExpenseData]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAmountVisibility}
              className="flex items-center gap-2"
            >
              {isAmountVisible ? (
                <Eye size={16} className="text-blue-light" />
              ) : (
                <EyeOff size={16} className="text-gray-400" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span>Actualizar datos</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <MonthlyTotal
              total={expenseData.total_mes}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12 lg:col-span-5">
              <WeeklyChart 
                data={expenseData.resumen_semanal} 
                isLoading={isLoading} 
              />
            </div>
            
            <div className="md:col-span-12 lg:col-span-7">
              <ExpenseTable 
                expenses={expenseData.gastos} 
                isLoading={isLoading} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-100 py-4 mt-auto bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 ClariFi — Control Financiero Inteligente
          </p>
        </div>
      </footer>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <AmountVisibilityProvider>
      <DashboardContent />
    </AmountVisibilityProvider>
  );
};

export default Dashboard;
