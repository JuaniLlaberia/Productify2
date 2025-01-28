'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type PanelContextType = {
  isOpen: boolean;
  content: ReactNode | null;
  openPanel: (options: { content: ReactNode }) => void;
  closePanel: () => void;
};

const PanelContext = createContext<PanelContextType>({
  isOpen: false,
  content: null,
  openPanel: () => {},
  closePanel: () => {},
});

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openPanel = ({ content: panelContent }: { content: ReactNode }) => {
    if (isOpen) {
      closePanel();
    }

    setContent(panelContent);
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <PanelContext.Provider
      value={{
        isOpen,
        content,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
};
