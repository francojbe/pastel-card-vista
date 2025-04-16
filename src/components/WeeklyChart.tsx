
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

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
      <div className="card-dashboard h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-light"></div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="card-dashboard h-[300px] flex items-center justify-center">
        <p className="text-gray-400 text-lg">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="card-dashboard">
      <h2 className="text-xl font-display font-semibold mb-4">Resumen Semanal</h2>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), "Gasto"]}
              contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="monto" 
              stroke="#3b82f6" 
              fill="#d3e5fa" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;
