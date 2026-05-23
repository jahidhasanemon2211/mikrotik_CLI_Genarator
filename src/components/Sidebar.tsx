import React, { useEffect } from 'react';
import { 
  Network, 
  Globe, 
  ShieldAlert, 
  Gauge, 
  Users, 
  Route,
  Wrench,
  Layers,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAppContext } from '../store';
import { ConfigTab } from '../types';

const tabs: { id: ConfigTab; label: string; icon: React.FC<any>; subs?: { id: string; label: string }[] }[] = [
  { 
    id: 'interfaces', label: 'Interfaces', icon: Network, 
    subs: [{ id: 'interfaces', label: 'Interfaces' }, { id: 'tunnels', label: 'Tunnels (EoIP/IPIP/GRE)' }] 
  },
  { 
    id: 'bridge', label: 'Bridge', icon: Layers, 
    subs: [{ id: 'bridges', label: 'Bridge' }] 
  },
  { 
    id: 'ppp', label: 'PPP', icon: Users, 
    subs: [{ id: 'servers', label: 'PPPoE Servers' }, { id: 'profiles', label: 'Profiles' }, { id: 'secrets', label: 'Secrets' }] 
  },
  { 
    id: 'ip', label: 'IP', icon: Globe, 
    subs: [{ id: 'addresses', label: 'Addresses' }, { id: 'dns', label: 'DNS' }, { id: 'pool', label: 'Pool' }, { id: 'firewall', label: 'Firewall' }] 
  },
  { 
    id: 'routing', label: 'Routing', icon: Route, 
    subs: [{ id: 'bgp', label: 'BGP' }] 
  },
  { 
    id: 'queues', label: 'Queues', icon: Gauge, 
    subs: [{ id: 'simple', label: 'Simple Queues' }] 
  },
  { 
    id: 'tools', label: 'Tools', icon: Wrench, 
    subs: [{ id: 'migration', label: 'Migration' }] 
  },
];

export function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    activeSubTab, 
    setActiveSubTab, 
    theme, 
    setTheme,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useAppContext();

  // Set default sub tab when tab changes
  useEffect(() => {
    const tabOpts = tabs.find(t => t.id === activeTab);
    if (tabOpts?.subs && tabOpts.subs.length > 0) {
      if (!tabOpts.subs.find(s => s.id === activeSubTab)) {
        setActiveSubTab(tabOpts.subs[0].id);
      }
    } else {
      setActiveSubTab(null);
    }
  }, [activeTab]);

  return (
    <>
      {/* Dimmed backdrop overlay on mobile/tablet */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 lg:static z-50 lg:z-20 w-60 flex flex-col border-r border-border bg-sidebar-bg h-full shrink-0 transition-transform duration-300 ease-in-out ${
        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 border-b border-border flex items-center justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-color/5 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-color to-[#00D4FF] p-[1px] shadow-[0_0_15px_rgba(0,168,230,0.4)]">
               <div className="w-full h-full bg-sidebar-bg rounded-[7px] flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-color/20"></div>
                 <div className="w-2.5 h-2.5 bg-brand-color rounded-sm shadow-[0_0_8px_var(--color-brand)] animate-pulse"></div>
               </div>
            </div>
            <h1 className="text-sm font-black tracking-widest bg-gradient-to-r from-text-main to-text-muted text-transparent bg-clip-text uppercase">WinBox Gen</h1>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-text-muted hover:text-brand-color rounded-md transition-colors relative z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto w-full space-y-1.5 px-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div key={tab.id} className="w-full group/nav">
                <button
                  onClick={() => {
                     setActiveTab(tab.id);
                     if (tab.subs) setActiveSubTab(tab.subs[0].id);
                     setMobileSidebarOpen(false);
                  }}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl overflow-hidden ${
                    isActive 
                      ? 'text-brand-color bg-brand-color/10 shadow-[inset_0_1px_rgba(255,255,255,0.05)]' 
                      : 'text-text-muted hover:text-text-main hover:bg-text-main/5'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-brand-color rounded-r-full shadow-[0_0_8px_var(--color-brand)]"></div>
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon 
                      size={16} 
                      className={`transition-transform duration-300 ${isActive ? 'text-brand-color scale-110' : 'text-text-muted/70 group-hover/nav:text-text-main group-hover/nav:scale-110'}`} 
                    />
                    <span className="tracking-wide">{tab.label}</span>
                  </div>
                  {tab.subs && (
                    <div className="relative z-10 transition-transform duration-300">
                      {isActive ? <ChevronDown size={14} className="opacity-70" /> : <ChevronRight size={14} className="opacity-40 group-hover/nav:opacity-70 group-hover/nav:translate-x-0.5" />}
                    </div>
                  )}
                </button>
                
                {/* Expandable Sub-menus */}
                {isActive && tab.subs && (
                  <div className="mt-1.5 mb-3 ml-[22px] border-l-2 border-border/40 pl-3 space-y-1 relative">
                    {/* Overlay gradient over the line */}
                    <div className="absolute left-[-2px] inset-y-0 w-[2px] bg-gradient-to-b from-brand-color/50 to-transparent shadow-[0_0_8px_var(--color-brand)] opacity-60"></div>
                    
                    {tab.subs.map(sub => {
                      const isSubActive = activeSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSubTab(sub.id);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 text-left px-3 py-2 text-[11px] rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? 'text-brand-color font-bold bg-brand-color/10 shadow-[inset_1px_1px_rgba(255,255,255,0.03)]'
                              : 'text-text-muted/80 font-medium hover:text-text-main hover:bg-text-main/5 hover:translate-x-0.5'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSubActive ? 'bg-brand-color shadow-[0_0_6px_var(--color-brand)]' : 'bg-transparent'}`} />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-5 border-t border-border flex flex-col gap-4 bg-sidebar-bg shrink-0 relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/5 dark:from-white/[0.02] to-transparent pointer-events-none"></div>
          <span className="text-[9px] font-mono font-bold tracking-widest text-text-muted uppercase flex items-center justify-between">
            Console Mode
            <span className="w-10 h-[1px] bg-gradient-to-r from-border to-transparent"></span>
          </span>
          <div className="flex items-center justify-between gap-2">
            {/* 3D Tactile Rocker Switch */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border border-slate-400/30 dark:border-slate-800 transition-colors duration-300 ease-in-out focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-gradient-to-b from-slate-950 to-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-2px_4px_rgba(255,255,255,0.05),_0_1px_0_rgba(255,255,255,0.05)]' 
                  : 'bg-gradient-to-b from-slate-300 to-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),_inset_0_-1px_0_rgba(255,255,255,0.5),_0_1px_1px_rgba(0,0,0,0.05)]'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="sr-only">Toggle Console Mode</span>
              
              {/* Rocker Indicator Lamp switch slider */}
              <span
                className={`absolute top-[3px] transition-all duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] h-5 w-5 rounded-full flex items-center justify-center border ${
                  theme === 'dark'
                    ? 'left-[30px] from-slate-800 to-slate-900 border-slate-700 shadow-[0_3px_5px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.1)] bg-gradient-to-b'
                    : 'left-[4px] from-white to-slate-100 border-slate-300 shadow-[0_3px_5px_rgba(0,0,0,0.15),_inset_0_1px_0_rgba(255,255,255,1)] bg-gradient-to-b'
                }`}
              >
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-brand-color shadow-[0_0_8px_var(--color-brand)]' 
                    : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                }`} />
              </span>
            </button>

            <div className="flex flex-col items-end text-[9px] font-bold">
               <span className="text-text-muted uppercase tracking-wider">CONSOLE LINK</span>
               <span className={`${theme === 'dark' ? 'text-brand-color' : 'text-amber-600'} flex items-center gap-1`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-brand-color animate-pulse' : 'bg-amber-500'} shadow-[0_0_6px_currentColor]`}></span> 
                 {theme === 'dark' ? 'DARK_NET' : 'LIGHT_NET'}
               </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
