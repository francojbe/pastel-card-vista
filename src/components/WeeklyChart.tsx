
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { BarChart2 } from 'lucide-react';

interface WeeklyChartProps {
  data: { name: string; monto: number }[];
  isLoading: boolean;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, isLoading }) => {
  const chartData = data;

  if (isLoading) {
    return (
      <div className="neo-card h-[380px] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#2563FF]/10 border-t-[#2563FF] animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="neo-card h-[380px] flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="expense-icon">
            <BarChart2 size={22} />
          </div>
          <div>
            <h2 className="text-[#0F172A] font-bold text-lg">Actividad Semanal</h2>
            <p className="text-[#64748B] text-xs font-medium">Análisis de flujo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2563FF]" />
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Actual</span>
        </div>
      </div>

      <div className="flex-1 w-full overflow-x-auto no-scrollbar">
        {!Array.isArray(data) || data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] gap-3">
            <BarChart2 size={48} className="opacity-20" />
            <p className="text-sm font-medium">Sin datos registrados</p>
          </div>
        ) : (
          <div style={{ minWidth: Math.max(350, data.length * 65) + 'px', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 0, right: 20, left: 20, bottom: 25 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                  interval={0}
                />
                <YAxis 
                  hide
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(37, 99, 255, 0.05)', radius: [12, 12, 12, 12] }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-[#E5EAF2] p-3 rounded-2xl shadow-neo animate-in fade-in zoom-in duration-200">
                          <p className="text-[#64748B] text-[10px] font-bold uppercase mb-1">{payload[0].payload.name}</p>
                          <p className="text-[#0F172A] text-lg font-bold tracking-tight">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="monto" 
                  fill="#2563FF" 
                  radius={[10, 10, 10, 10]}
                  background={{ fill: '#F1F5F9', radius: 10 }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.monto > 0 ? '#2563FF' : '#E5EAF2'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyChart;
