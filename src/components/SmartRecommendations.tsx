
import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

const recommendations = [
  {
    title: '¡Buen trabajo! Tus gastos bajaron',
    description: 'Tus gastos discrecionales disminuyeron un 12% comparado con la semana pasada.',
    icon: <Sparkles size={20} />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    title: 'Oportunidad de Inversión',
    description: 'Basado en tu portafolio, considera diversificar en ETFs tecnológicos que están al alza.',
    icon: <TrendingUp size={20} />,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  }
];

const SmartRecommendations: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#0F172A] font-bold text-lg">Insights IA</h2>
        <button className="text-[#2563FF] text-[11px] font-bold">Ver todo</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white rounded-[24px] p-5 flex gap-4 items-start shadow-sm border border-white">
            <div className={`${rec.bg} ${rec.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
              {rec.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-[#0F172A] text-[14px]">{rec.title}</h3>
              <p className="text-[#64748B] text-[12px] leading-[1.4] font-medium">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;
