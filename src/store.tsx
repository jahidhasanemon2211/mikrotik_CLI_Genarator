import React, { createContext, useContext, useState } from 'react';
import { AppState, ConfigTab } from './types';

const initialState: AppState = {
  bridges: [],
  vlans: [],
  ipAddresses: [],
  dns: { primary: '', secondary: '', allowRemoteRequests: true },
  ipPools: [],
  poolSettings: { masterNetwork: '', poolCidr: '' },
  srcNat: [],
  dstNat: [],
  queueTypes: [],
  queues: [],
  pppoeProfiles: [],
  pppoeSecrets: [],
  pppoeServers: [],
  eoipTunnels: [],
  bgp: {
    routerOsVersion: 'v7',
    templates: [],
    peers: []
  }
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  activeTab: ConfigTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ConfigTab>>;
  activeSubTab: string | null;
  setActiveSubTab: React.Dispatch<React.SetStateAction<string | null>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileActiveView: 'form' | 'output';
  setMobileActiveView: React.Dispatch<React.SetStateAction<'form' | 'output'>>;
  updateItem: <K extends keyof AppState>(key: K, id: string, data: any) => void;
  addItem: <K extends keyof AppState>(key: K, data: any) => void;
  removeItem: <K extends keyof AppState>(key: K, id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<ConfigTab>(null);
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [mobileActiveView, setMobileActiveView] = useState<'form' | 'output'>('form');

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addItem = <K extends keyof AppState>(key: K, data: any) => {
    setState(prev => {
      if (key === 'bgp') {
        const bgpPrev = prev[key] as any;
        return {
          ...prev,
          bgp: {
            ...bgpPrev,
            peers: [...bgpPrev.peers, { id: crypto.randomUUID(), ...data }]
          }
        };
      }
      return {
        ...prev,
        [key]: [...(prev[key] as any), { id: crypto.randomUUID(), ...data }]
      };
    });
  };

  const updateItem = <K extends keyof AppState>(key: K, id: string, data: any) => {
    setState(prev => {
      if (key === 'bgp') {
        const bgpPrev = prev[key] as any;
        return {
          ...prev,
          bgp: {
             ...bgpPrev,
             peers: bgpPrev.peers.map((item: any) => item.id === id ? { ...item, ...data } : item)
          }
        };
      }
      return {
        ...prev,
        [key]: (prev[key] as any).map((item: any) => item.id === id ? { ...item, ...data } : item)
      }
    });
  };

  const removeItem = <K extends keyof AppState>(key: K, id: string) => {
    setState(prev => {
      if (key === 'bgp') {
        const bgpPrev = prev[key] as any;
        return {
          ...prev,
          bgp: {
             ...bgpPrev,
             peers: bgpPrev.peers.filter((item: any) => item.id !== id)
          }
        };
      }
      return {
        ...prev,
        [key]: (prev[key] as any).filter((item: any) => item.id !== id)
      }
    });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      setState, 
      theme, 
      setTheme, 
      activeTab, 
      setActiveTab, 
      activeSubTab, 
      setActiveSubTab, 
      mobileSidebarOpen, 
      setMobileSidebarOpen, 
      mobileActiveView, 
      setMobileActiveView, 
      updateItem, 
      addItem, 
      removeItem 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
