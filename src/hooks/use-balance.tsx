
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  addToBalance: (amount: number) => void;
  subtractFromBalance: (amount: number) => boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(10000);

  const addToBalance = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const subtractFromBalance = (amount: number) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance, addToBalance, subtractFromBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
