import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WeeklyChart from '../components/WeeklyChart';
import ExpenseTable from '../components/ExpenseTable';
import BottomNavigation from '../components/BottomNavigation';
import { formatCurrency } from '../utils/formatters';
import { ExpenseData } from '../types/expense';
import { ArrowLeft, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MonthSelector from '../components/MonthSelector';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    total_mes: 0,
    gastos: [],
    resumen_semanal: []
  });
  const [allFetchedData, setAllFetchedData] = useState<Record<string, ExpenseData>>({});
  const cacheRef = useRef<Record<string, ExpenseData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const fetchExpenseData = useCallback(async (period: string, date: Date) => {
    setIsLoading(true);
    
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

      monthsToFetch.forEach((m, i) => {
        if (results[i]) cacheRef.current[m] = results[i];
      });
      
      setAllFetchedData({ ...cacheRef.current });
      
      const currentMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (cacheRef.current[currentMonthKey]) {
        setExpenseData(cacheRef.current[currentMonthKey]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseData(selectedPeriod, viewDate);
  }, [selectedPeriod, viewDate, fetchExpenseData]);

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

    // Sort by date descending (most recent first)
    const sortedGastos = [...filteredGastos].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    return {
      ...expenseData,
      gastos: sortedGastos
    };
  }, [expenseData, selectedPeriod, allFetchedData, viewDate]);

  const insights = React.useMemo(() => {
    if (!filteredData.gastos.length) return { active: '-', average: 0, label: 'Día', avgLabel: 'Promedio' };

    if (selectedPeriod === 'week') {
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      const daily = new Array(7).fill(0);
      filteredData.gastos.forEach(g => daily[new Date(g.fecha).getDay()] += g.monto);
      const maxIdx = daily.indexOf(Math.max(...daily));
      const avg = daily.reduce((a, b) => a + b, 0) / 7;
      return { active: days[maxIdx], average: avg, label: 'Día', avgLabel: 'Promedio Diario' };
    } 

    if (selectedPeriod === 'month') {
      const weekly = expenseData.resumen_semanal || [];
      const maxIdx = weekly.indexOf(Math.max(...weekly));
      const avg = weekly.reduce((a, b) => a + b, 0) / (weekly.length || 1);
      return { active: `Semana ${maxIdx + 1}`, average: avg, label: 'Semana', avgLabel: 'Promedio Semanal' };
    }

    if (selectedPeriod === 'year') {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthly = new Array(12).fill(0);
      filteredData.gastos.forEach(g => monthly[new Date(g.fecha).getMonth()] += g.monto);
      const maxIdx = monthly.indexOf(Math.max(...monthly));
      const avg = monthly.reduce((a, b) => a + b, 0) / 12;
      return { active: months[maxIdx], average: avg, label: 'Mes', avgLabel: 'Promedio Mensual' };
    }

    return { active: '-', average: 0, label: 'Periodo', avgLabel: 'Promedio' };
  }, [filteredData.gastos, selectedPeriod, expenseData.resumen_semanal]);

  const chartData = React.useMemo(() => {
    const allExpenses = Object.values(allFetchedData).flatMap(d => d.gastos);

    if (selectedPeriod === 'week') {
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      const dailyTotals: Record<string, number> = {};
      days.forEach(day => dailyTotals[day] = 0);

      const startOfWeek = new Date(viewDate);
      startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      filteredData.gastos.forEach(g => {
        const d = new Date(g.fecha);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        if (d >= startOfWeek && d < endOfWeek) {
          const dayName = days[d.getDay()];
          dailyTotals[dayName] += g.monto;
        }
      });

      const orderedDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      return orderedDays.map(day => ({
        name: day,
        monto: dailyTotals[day]
      }));

    } else if (selectedPeriod === 'month') {
      // Para el mes, dividimos en semanas o días
      return (expenseData.resumen_semanal || []).map((monto, i) => ({
        name: `Sem ${i + 1}`,
        monto: monto
      }));

    } else if (selectedPeriod === 'year') {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthlyTotals: Record<string, number> = {};
      months.forEach(m => monthlyTotals[m] = 0);

      const year = viewDate.getFullYear();
      allExpenses.forEach(g => {
        const d = new Date(g.fecha);
        if (d.getFullYear() === year) {
          const monthName = months[d.getMonth()];
          monthlyTotals[monthName] += g.monto;
        }
      });

      return months.map(m => ({
        name: m,
        monto: monthlyTotals[m]
      }));

    } else if (selectedPeriod === 'all') {
      // Agrupar por año para la vista 'Todo'
      const yearTotals: Record<string, number> = {};
      allExpenses.forEach(g => {
        const year = new Date(g.fecha).getFullYear().toString();
        yearTotals[year] = (yearTotals[year] || 0) + g.monto;
      });

      return Object.entries(yearTotals)
        .sort(([yearA], [yearB]) => yearA.localeCompare(yearB))
        .map(([year, total]) => ({
          name: year,
          monto: total
        }));
    }

    return [];
  }, [allFetchedData, filteredData.gastos, selectedPeriod, expenseData.resumen_semanal]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] pb-32 font-sans">
      {/* Analytics Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#EEF2F7] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-6 space-y-8">
        {/* Period Selector with Navigation */}
        <div className="bg-[#E5EAF2]/50 p-1 rounded-2xl flex items-center justify-between">
          <MonthSelector selectedMonth={selectedPeriod} onMonthChange={handlePeriodChange} />
          
          <div className="flex items-center gap-2 pr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 rounded-full hover:bg-white/50 text-[#64748B]"
              onClick={() => navigatePeriod('prev')}
            >
              <ChevronLeft size={16} />
            </Button>
            
            <span className="text-[10px] font-bold uppercase tracking-wider min-w-[80px] text-center text-[#64748B]">
              {selectedPeriod === 'week' ? `Sem. ${viewDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}` : 
               selectedPeriod === 'month' ? viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) :
               selectedPeriod === 'year' ? viewDate.getFullYear() : 'Todo'}
            </span>

            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 rounded-full hover:bg-white/50 text-[#64748B]"
              onClick={() => navigatePeriod('next')}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* The Weekly Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#0F172A] font-bold text-lg">Actividad Semanal</h3>
            <span className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest">Resumen del periodo</span>
          </div>
          <WeeklyChart 
            data={chartData} 
            isLoading={isLoading} 
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white">
            <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">{insights.label} más activo</p>
            <p className="text-[#0F172A] text-lg font-bold">{insights.active}</p>
          </div>
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white">
            <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">{insights.avgLabel}</p>
            <p className="text-[#0F172A] text-lg font-bold">{formatCurrency(insights.average)}</p>
          </div>
        </div>

        {/* Full Transaction List */}
        <div className="space-y-4">
          <h3 className="text-[#0F172A] font-bold text-lg">Todas las transacciones</h3>
          <ExpenseTable 
            expenses={filteredData.gastos} 
            isLoading={isLoading} 
            showViewAll={false}
          />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Analytics;
