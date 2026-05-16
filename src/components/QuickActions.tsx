import { Send, Wallet, TrendingUp, CreditCard } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    { icon: <Send size={20} />, label: 'Enviar', color: 'bg-[#F1F5F9]', textColor: 'text-[#2563FF]' },
    { icon: <Wallet size={20} />, label: 'Pagar', color: 'bg-[#F1F5F9]', textColor: 'text-[#F59E0B]' },
    { icon: <TrendingUp size={20} />, label: 'Invertir', color: 'bg-[#F1F5F9]', textColor: 'text-[#10B981]' },
    { icon: <CreditCard size={20} />, label: 'Tarjetas', color: 'bg-[#F1F5F9]', textColor: 'text-[#7C4DFF]' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[#0F172A] font-bold text-lg">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`${action.color} ${action.textColor} w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm border border-transparent hover:border-gray-100`}>
              {action.icon}
            </div>
            <span className="text-[11px] font-bold text-[#64748B]">{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
