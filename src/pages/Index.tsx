import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import MonthlyTotal from '../components/MonthlyTotal';
import ExpenseTable from '../components/ExpenseTable';
import SmartRecommendations from '../components/SmartRecommendations';
import BottomNavigation from '../components/BottomNavigation';
import { getMonthOptions, formatCurrency } from '../utils/formatters';
import { ExpenseData } from '../types/expense';
import { toast } from 'sonner';
import { RefreshCw, Eye, EyeOff, Bell, Search, Plus, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAmountVisibility } from '../contexts/AmountVisibilityContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from '../lib/supabase';

const PERSONAL_ID = '7ae84675-26a8-4856-936a-b99bdb63ad3d';

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    total_mes: 0,
    gastos: [],
    resumen_semanal: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Franco Blanco');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('nombre')
        .eq('id', PERSONAL_ID)
        .maybeSingle();
      
      if (data?.nombre) {
        setUserName(data.nombre);
      }
    };
    fetchProfile();
  }, []);

  const { isAmountVisible, toggleAmountVisibility } = useAmountVisibility();

  const [allFetchedData, setAllFetchedData] = useState<Record<string, ExpenseData>>({});
  const cacheRef = useRef<Record<string, ExpenseData>>({});
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [recentNotifications, setRecentNotifications] = useState<{ id: string; msg: string; time: string }[]>([]);
  const prevExpensesRef = useRef<string[]>([]);

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (selectedPeriod === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (selectedPeriod === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (selectedPeriod === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setViewDate(newDate);
  };

  const fetchExpenseData = useCallback(async (period: string, date: Date, showToast: boolean = false) => {
    setIsRefreshing(true);
    
    try {
      const monthsToFetch = [];
      const numMonths = (period === 'year' || period === 'all') ? 24 : 3;
      
      for (let i = 0; i < numMonths; i++) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        monthsToFetch.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }

      const results = await Promise.all(
        monthsToFetch.map(async (m) => {
          if (cacheRef.current[m]) return cacheRef.current[m];
          try {
            const resp = await fetch(`https://n8n.efinnovation.cl/webhook/Envio-data?mes=${m}`);
            const text = await resp.text();
            if (!text || text.trim() === "") return null;
            return JSON.parse(text);
          } catch (e) {
            return null;
          }
        })
      );

      // Actualizar Ref y State
      monthsToFetch.forEach((m, i) => {
        if (results[i]) cacheRef.current[m] = results[i];
      });
      
      setAllFetchedData({ ...cacheRef.current });
      
      const currentMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (cacheRef.current[currentMonthKey]) {
        const newData = cacheRef.current[currentMonthKey];
        
        // Detect new transactions
        const newExpenseIds = newData.gastos.map(g => `${g.comercio}-${g.fecha}-${g.hora}`);
        
        if (prevExpensesRef.current.length > 0) {
          const newItems = newData.gastos.filter(g => {
            const id = `${g.comercio}-${g.fecha}-${g.hora}`;
            return !prevExpensesRef.current.includes(id);
          });

          if (newItems.length > 0) {
            const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            const newNotifs = newItems.map(g => ({
              id: `${g.comercio}-${g.fecha}-${g.hora}-${Math.random()}`,
              msg: `Nuevo gasto en ${g.comercio}: ${formatCurrency(g.monto)}`,
              time: now
            }));
            
            setRecentNotifications(prev => [...newNotifs, ...prev].slice(0, 10)); // Keep last 10
            setNotificationCount(prev => prev + newItems.length);
            toast.info(`Tienes ${newItems.length} nueva(s) transacción(es)`);
          }
        }
        
        prevExpensesRef.current = newExpenseIds;
        setExpenseData(newData);
      } else {
        setExpenseData({ total_mes: 0, gastos: [], resumen_semanal: [] });
      }


      if (showToast) {
        toast.success("Datos actualizados");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseData(selectedPeriod, viewDate);
  }, [selectedPeriod, viewDate, fetchExpenseData]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchExpenseData(selectedPeriod, viewDate), 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedPeriod, fetchExpenseData]);

  const trendData = React.useMemo(() => {
    const now = new Date();
    let currentTotal = 0;
    let previousTotal = 0;

    const allExpenses = Object.values(allFetchedData).flatMap(d => d.gastos);

    if (selectedPeriod === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(now.getDate() - 14);

      currentTotal = allExpenses
        .filter(g => {
          const d = new Date(g.fecha);
          return d >= sevenDaysAgo && d <= now;
        })
        .reduce((sum, g) => sum + g.monto, 0);

      previousTotal = allExpenses
        .filter(g => {
          const d = new Date(g.fecha);
          return d >= fourteenDaysAgo && d < sevenDaysAgo;
        })
        .reduce((sum, g) => sum + g.monto, 0);

    } else if (selectedPeriod === 'month') {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();

      currentTotal = allExpenses
        .filter(g => {
          const d = new Date(g.fecha);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, g) => sum + g.monto, 0);

      previousTotal = allExpenses
        .filter(g => {
          const d = new Date(g.fecha);
          return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
        })
        .reduce((sum, g) => sum + g.monto, 0);

    } else if (selectedPeriod === 'year') {
      const currentYear = now.getFullYear();
      const prevYear = currentYear - 1;

      currentTotal = allExpenses
        .filter(g => new Date(g.fecha).getFullYear() === currentYear)
        .reduce((sum, g) => sum + g.monto, 0);

      previousTotal = allExpenses
        .filter(g => new Date(g.fecha).getFullYear() === prevYear)
        .reduce((sum, g) => sum + g.monto, 0);
    }

    if (previousTotal === 0) return 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  }, [allFetchedData, selectedPeriod]);

  const handlePeriodChange = (period: string) => setSelectedPeriod(period);

  const filteredData = React.useMemo(() => {
    const allExpenses = Object.values(allFetchedData).flatMap(d => d.gastos);
    let filteredGastos = [];

    if (selectedPeriod === 'week') {
      const start = new Date(viewDate);
      start.setDate(viewDate.getDate() - viewDate.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      
      filteredGastos = allExpenses.filter(g => {
        const d = new Date(g.fecha);
        return d >= start && d < end;
      });
    } else if (selectedPeriod === 'month') {
      const currentMonth = viewDate.getMonth();
      const currentYear = viewDate.getFullYear();
      filteredGastos = allExpenses.filter(g => {
        const d = new Date(g.fecha);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    } else if (selectedPeriod === 'year') {
      const currentYear = viewDate.getFullYear();
      filteredGastos = allExpenses.filter(g => new Date(g.fecha).getFullYear() === currentYear);
    } else {
      filteredGastos = allExpenses;
    }

    const newTotal = filteredGastos.reduce((sum, g) => sum + g.monto, 0);

    // Sort by date descending (most recent first)
    const sortedGastos = [...filteredGastos].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    return {
      ...expenseData,
      total_mes: newTotal,
      gastos: sortedGastos
    };
  }, [expenseData, selectedPeriod, allFetchedData, viewDate]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] pb-32 md:pb-10 font-sans">
      {/* Premium Header */}
      <nav className="sticky top-0 z-40 bg-[#F5F7FB]/80 backdrop-blur-xl border-b border-transparent">
        <div className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563FF&color=fff`} alt="User" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Bienvenido de nuevo,</span>
              <h2 className="text-[15px] font-bold text-[#0F172A] leading-tight">{userName}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0F172A] hover:bg-white rounded-full w-10 h-10 shadow-sm border border-white relative"
                  onClick={() => setNotificationCount(0)}
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F5F7FB] animate-in zoom-in duration-300">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-2xl shadow-neo-lg border-white/50 bg-white/95 backdrop-blur-xl" align="end">
                <div className="p-4 border-b border-[#F1F5F9]">
                  <h3 className="font-bold text-[#0F172A]">Notificaciones</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#94A3B8]">
                        <Inbox size={20} />
                      </div>
                      <p className="text-sm text-[#94A3B8] font-medium">No tienes notificaciones</p>
                    </div>
                  ) : (
                    recentNotifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                        <p className="text-sm text-[#0F172A] font-medium leading-relaxed">{notif.msg}</p>
                        <p className="text-[10px] text-[#94A3B8] font-bold uppercase mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
                {recentNotifications.length > 0 && (
                  <div className="p-3 bg-[#F8FAFC] rounded-b-2xl text-center">
                    <button 
                      className="text-xs font-bold text-[#2563FF] hover:underline"
                      onClick={() => setRecentNotifications([])}
                    >
                      Limpiar todas
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
      
      <main className="max-w-3xl mx-auto px-6 pt-6 space-y-8">
        {/* 1. Hero Balance Card (includes Month Selection) */}
        <MonthlyTotal 
          total={filteredData.total_mes} 
          trend={12.5}
          selectedMonth={selectedPeriod} 
          onMonthChange={handlePeriodChange}
          isLoading={isLoading}
          onPrev={() => navigatePeriod('prev')}
          onNext={() => navigatePeriod('next')}
          dateLabel={
            selectedPeriod === 'week' ? `Sem. ${viewDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}` : 
            selectedPeriod === 'month' ? viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) :
            selectedPeriod === 'year' ? viewDate.getFullYear().toString() : 'Todo'
          }
        />

        {/* 2. AI Insights (Smart Recommendations) */}
        <SmartRecommendations />
        
        
        {/* 5. Transacciones Recientes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0F172A] font-bold text-lg">Transacciones más recientes</h2>
            <Button variant="ghost" size="sm" className="text-[#2563FF] font-bold text-xs" onClick={() => navigate('/analytics')}>
              Ver todo
            </Button>
          </div>
          <ExpenseTable 
            expenses={filteredData.gastos.slice(0, 5)} 
            isLoading={isLoading} 
          />
        </div>
        
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardContent;
