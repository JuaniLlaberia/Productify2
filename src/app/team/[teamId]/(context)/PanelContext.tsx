'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';

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

  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

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

  useEffect(() => {
    if (pathname !== lastPathname) {
      closePanel();
      setLastPathname(pathname);
    }
  }, [pathname, lastPathname]);

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
