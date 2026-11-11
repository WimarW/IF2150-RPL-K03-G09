import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UnreadContextType {
  unreadMessages: number;
  unreadNotifications: number;
  setUnreadMessages: (count: number | ((prev: number) => number)) => void;
  setUnreadNotifications: (count: number | ((prev: number) => number)) => void;
  decrementUnreadMessagesBy: (amount: number) => void;
}

const UnreadContext = createContext<UnreadContextType | undefined>(undefined);

export const UnreadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState<number>(3); // Initial mock state
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  const decrementUnreadMessagesBy = useCallback((amount: number) => {
    setUnreadMessages((prev) => Math.max(0, prev - amount));
  }, []);

  return (
    <UnreadContext.Provider
      value={{
        unreadMessages,
        unreadNotifications,
        setUnreadMessages,
        setUnreadNotifications,
        decrementUnreadMessagesBy,
      }}
    >
      {children}
    </UnreadContext.Provider>
  );
};

export function useUnreadCounts() {
  const context = useContext(UnreadContext);
  if (!context) {
    throw new Error('useUnreadCounts must be used within an UnreadProvider');
  }
  return context;
}