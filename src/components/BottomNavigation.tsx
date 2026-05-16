
import React from 'react';
import { LayoutDashboard, CreditCard, PieChart, Settings, User } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={24} />, label: 'Inicio', path: '/' },
    { icon: <PieChart size={24} />, label: 'Análisis', path: '/analytics' },
    { icon: <Settings size={24} />, label: 'Ajustes', path: '/settings' },
    { icon: <User size={24} />, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EEF2F7] h-[84px] px-8 flex justify-between items-center z-50 md:hidden">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={index} 
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#2563FF]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
