
import React from 'react';

interface CategoryConfig {
  emoji: string;
  bgColor: string;
  keywords: string[];
}

const categories: Record<string, CategoryConfig> = {
  alimentacion: {
    emoji: '🍴',
    bgColor: 'bg-[#FF9500]', // iOS Orange
    keywords: ['restaurant', 'cafe', 'starbucks', 'mcdonalds', 'pizza', 'burger', 'eats', 'rappi', 'food', 'comida', 'bistro', 'bakery', 'pasteleria', 'sushi', 'dunkin']
  },
  transporte: {
    emoji: '🚗',
    bgColor: 'bg-[#5856D6]', // iOS Indigo
    keywords: ['uber', 'cabify', 'didi', 'gas', 'shell', 'copec', 'petrobras', 'parking', 'estacionamiento', 'peaje', 'metro', 'transantiago', 'autopista', 'latam', 'sky', 'jetsmart']
  },
  compras: {
    emoji: '🛍️',
    bgColor: 'bg-[#FF2D55]', // iOS Pink
    keywords: ['amazon', 'lider', 'jumbo', 'unimarc', 'mercado', 'mall', 'falabella', 'ripley', 'paris', 'sodimac', 'easy', 'walmart', 'tienda', 'supermercado', 'express', 'tottus', 'h&m', 'zara']
  },
  suscripciones: {
    emoji: '📱',
    bgColor: 'bg-[#007AFF]', // iOS Blue
    keywords: ['netflix', 'spotify', 'disney', 'apple', 'google', 'cloud', 'adobe', 'microsoft', 'hbomax', 'prime', 'crunchyroll', 'youtube', 'patreon']
  },
  salud: {
    emoji: '💊',
    bgColor: 'bg-[#34C759]', // iOS Green
    keywords: ['pharmacy', 'farmacia', 'doctor', 'hospital', 'clinica', 'dental', 'optica', 'cruz verde', 'salcobrand', 'ahumada', 'medicina']
  },
  servicios: {
    emoji: '🧾',
    bgColor: 'bg-[#AF52DE]', // iOS Purple
    keywords: ['agua', 'luz', 'gas', 'vtr', 'movistar', 'entel', 'claro', 'wom', 'internet', 'seguro', 'banco', 'santander', 'chile', 'itau', 'bci', 'tgr', 'sii']
  }
};

interface ExpenseIconProps {
  commerceName: string;
}

const ExpenseIcon: React.FC<ExpenseIconProps> = ({ commerceName }) => {
  const name = commerceName.toLowerCase();

  // Buscar coincidencia por categoría
  const foundCategory = Object.entries(categories).find(([_, config]) => 
    config.keywords.some(keyword => name.includes(keyword))
  );

  if (foundCategory) {
    const [_, config] = foundCategory;
    return (
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center bg-[#F1F5F9] text-[20px] transition-transform duration-300 group-hover:scale-110`}>
        {config.emoji}
      </div>
    );
  }

  // Fallback estilo Apple Pay
  return (
    <div className="w-11 h-11 rounded-[14px] flex items-center justify-center bg-[#F1F5F9] text-xl transition-transform duration-300 group-hover:scale-110">
      💳
    </div>
  );
};

export default ExpenseIcon;
