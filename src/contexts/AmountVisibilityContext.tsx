
import React, { createContext, useContext, useState } from 'react';

type AmountVisibilityContextType = {
  isAmountVisible: boolean;
  toggleAmountVisibility: () => void;
};

const AmountVisibilityContext = createContext<AmountVisibilityContextType | undefined>(undefined);

export const AmountVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  const toggleAmountVisibility = () => {
    setIsAmountVisible(prev => !prev);
  };

  return (
    <AmountVisibilityContext.Provider value={{ isAmountVisible, toggleAmountVisibility }}>
      {children}
    </AmountVisibilityContext.Provider>
  );
};

export const useAmountVisibility = () => {
  const context = useContext(AmountVisibilityContext);
  if (context === undefined) {
    throw new Error('useAmountVisibility must be used within an AmountVisibilityProvider');
  }
  return context;
};
