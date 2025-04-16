
// Formatea un número como moneda en formato chileno ($ 1.234,00)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formatea una fecha ISO como "DD/MM/YYYY"
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Obtiene una matriz con nombres de meses y sus valores para el selector
export const getMonthOptions = (): { label: string; value: string }[] => {
  const options = [];
  const today = new Date();
  
  // Generar opciones para el último año (12 meses)
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYear = date.toLocaleString('es-CL', { month: 'short', year: 'numeric' });
    
    // Formato YYYY-MM para el endpoint
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    options.push({
      label: monthYear,
      value: value
    });
  }
  
  return options;
};
