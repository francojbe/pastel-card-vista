
import React from 'react';
import { 
  CreditCard, ShoppingCart, Coffee, Utensils, Music, 
  Film, Plane, Car, HeadphonesIcon, Pizza, Gift, Bomb, 
  Wine, Apple, Book, Smartphone
} from 'lucide-react';

// Mapeo de nombres de comercios a íconos y colores
const commerceIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  'Spotify': { icon: <Music size={18} />, color: 'bg-green-400/10 text-green-500' },
  'Uber': { icon: <Car size={18} />, color: 'bg-black/10 text-black' },
  'Netflix': { icon: <Film size={18} />, color: 'bg-red-400/10 text-red-500' },
  'Amazon': { icon: <ShoppingCart size={18} />, color: 'bg-orange-400/10 text-orange-500' },
  'Starbucks': { icon: <Coffee size={18} />, color: 'bg-green-800/10 text-green-800' },
  'Apple': { icon: <Apple size={18} />, color: 'bg-gray-800/10 text-gray-800' },
  'McDonalds': { icon: <Utensils size={18} />, color: 'bg-yellow-600/10 text-yellow-600' },
  'LATAM': { icon: <Plane size={18} />, color: 'bg-blue-600/10 text-blue-600' },
  'Dominos': { icon: <Pizza size={18} />, color: 'bg-blue-500/10 text-blue-500' },
  'Falabella': { icon: <ShoppingCart size={18} />, color: 'bg-green-700/10 text-green-700' },
  'Cinemark': { icon: <Film size={18} />, color: 'bg-purple-500/10 text-purple-500' },
  'Lider': { icon: <ShoppingCart size={18} />, color: 'bg-blue-400/10 text-blue-400' },
  'MercadoLibre': { icon: <Gift size={18} />, color: 'bg-yellow-500/10 text-yellow-500' },
  'Jumbo': { icon: <ShoppingCart size={18} />, color: 'bg-green-500/10 text-green-500' },
  'Tinder': { icon: <Bomb size={18} />, color: 'bg-red-600/10 text-red-600' },
  'GiftCard': { icon: <Gift size={18} />, color: 'bg-pink-500/10 text-pink-500' },
  'Viña': { icon: <Wine size={18} />, color: 'bg-purple-800/10 text-purple-800' }
};

interface ExpenseIconProps {
  commerceName: string;
}

const ExpenseIcon: React.FC<ExpenseIconProps> = ({ commerceName }) => {
  // Buscar un icono que coincida con el comercio (insensible a mayúsculas/minúsculas)
  const matchedCommerce = Object.keys(commerceIcons).find(
    key => commerceName.toLowerCase().includes(key.toLowerCase())
  );

  // Si hay coincidencia, usar ese icono
  if (matchedCommerce) {
    const { icon, color } = commerceIcons[matchedCommerce];
    return <div className={`expense-icon ${color}`}>{icon}</div>;
  }

  // Icono predeterminado si no hay coincidencia
  return (
    <div className="expense-icon bg-gray-200/50 text-gray-500">
      <CreditCard size={18} />
    </div>
  );
};

export default ExpenseIcon;
