
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import MonthSelector from './MonthSelector';
import { Wallet, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAmountVisibility } from '../contexts/AmountVisibilityContext';
import { Button } from '@/components/ui/button';

interface MonthlyTotalProps {
  total: number;
  trend?: number;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  isLoading: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  dateLabel?: string;
}

const MonthlyTotal: React.FC<MonthlyTotalProps> = ({ 
  total, 
  trend = 0,
  selectedMonth, 
  onMonthChange,
  isLoading,
  onPrev,
  onNext,
  dateLabel
}) => {
  const { isAmountVisible } = useAmountVisibility();
  
  const isPositive = trend >= 0;
  const trendFormatted = `${isPositive ? '+' : ''}${trend.toFixed(1)}%`;

  return (
    <div className="space-y-4">
      {/* Segmented Control for Month Selection */}
      <div className="bg-[#E5EAF2]/50 p-1 rounded-2xl flex items-center justify-between">
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
        
        {onPrev && onNext && (
          <div className="flex items-center gap-2 pr-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/50 text-[#64748B]" onClick={onPrev}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-[10px] font-bold uppercase tracking-wider min-w-[80px] text-center text-[#64748B]">
              {dateLabel}
            </span>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/50 text-[#64748B]" onClick={onNext}>
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="hero-gradient rounded-[32px] p-8 shadow-neo-lg text-white relative overflow-hidden flex flex-col gap-8 transition-all duration-300 hover:shadow-blue-200/50">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Balance Total</p>
            <div className={`backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10 ${isPositive ? 'bg-white/20' : 'bg-red-500/30'}`}>
              <TrendingUp size={12} className={`text-white ${isPositive ? '' : 'rotate-180'}`} />
              <span className="text-[10px] font-bold">{trendFormatted}</span>
            </div>
          </div>
          {isLoading ? (
            <div className="h-12 w-48 bg-white/20 animate-pulse rounded-xl" />
          ) : (
            <h1 className="text-[36px] leading-none font-bold tracking-tight">
              {isAmountVisible ? formatCurrency(total) : '••••••••'}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTotal;
