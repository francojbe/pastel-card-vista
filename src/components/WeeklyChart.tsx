
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

interface WeeklyChartProps {
  data: number[];
  isLoading: boolean;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, isLoading }) => {
  // Ensure data is an array before mapping
  const chartData = Array.isArray(data) 
    ? data.map((amount, index) => ({
        name: `Semana ${index + 1}`,
        monto: amount,
      })) 
    : [];

  if (isLoading) {
    return (
      <div className="glass-card h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-light"></div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="glass-card h-[300px] flex items-center justify-center">
        <p className="text-gray-400 text-lg">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-green-mint/10 flex items-center justify-center">
          <TrendingUp className="text-green-mint" size={20} />
        </div>
        <h2 className="text-xl font-display font-semibold">Tendencia Semanal</h2>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              dy={10}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), "Gasto"]}
              contentStyle={{ 
                borderRadius: '0.75rem', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                border: '1px solid rgba(229, 231, 235, 0.5)',
                padding: '10px 14px' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="monto" 
              stroke="#10B981" 
              fill="url(#colorMonto)" 
              strokeWidth={3}
              activeDot={{ 
                r: 8, 
                strokeWidth: 3, 
                stroke: '#fff',
                fill: '#10B981'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;
