import React from 'react';
import { AppProvider, useAppContext } from './store';
import { Sidebar } from './components/Sidebar';
import { OutputPanel } from './components/OutputPanel';
import { InterfacesForm, BridgeForm, IPForm, FirewallForm, QueuesForm, PPPoEForm, TunnelsForm, ToolsForm } from './components/ConfigForms';

function MainContent() {
  const { 
    state,
    activeTab, 
    activeSubTab, 
    setMobileSidebarOpen, 
    mobileActiveView, 
    setMobileActiveView 
  } = useAppContext();

  if (!activeTab) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-w-0 bg-app-bg relative p-4">
        {/* Toggle burger for mobile layout on introduction card */}
        <div className="absolute top-4 left-4 lg:hidden">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-text-muted hover:text-text-main hover:bg-border rounded-lg transition-colors border border-border bg-panel-bg"
            title="Open Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Abstract design background elements */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(var(--color-brand) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
        </div>
        <div className="relative z-10 text-center p-8 sm:p-12 bg-panel-bg/80 rounded-2xl shadow-xl border border-border backdrop-blur-md max-w-md w-full mx-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-color/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_35px_rgba(0,168,230,0.15)] border border-brand-color/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 sm:w-10 sm:h-10 text-brand-color">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-text-main mb-3">Welcome to WinBox Gen</h1>
          <p className="text-text-muted text-xs sm:text-sm font-medium mb-8 leading-relaxed">
            Select a configuration module from the sidebar menu to begin building your RouterOS deployment.
          </p>

          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden mb-6 w-full py-2.5 px-4 bg-brand-color hover:bg-brand-color/80 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open Menu Drawer</span>
          </button>
          
          <div className="flex gap-4 items-center justify-center text-[10px] sm:text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
              RouterOS v7
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
            <span>Offline Gen</span>
          </div>
        </div>
      </main>
    );
  }

  const title = activeSubTab ? `${activeTab} > ${activeSubTab}`.replace(/([A-Z])/g, ' $1').trim() : activeTab.replace(/([A-Z])/g, ' $1').trim();

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-app-bg h-full overflow-hidden">
      <datalist id="interface-list">
        {Array.from({length: 8}).map((_, i) => <option key={`eth${i}`} value={`ether${i + 1}`} />)}
        <option value="sfp-sfpplus1" />
        {state.bridges.map(b => <option key={b.id} value={b.name} />)}
        {state.vlans.map(v => <option key={v.id} value={v.name} />)}
        {state.eoipTunnels.map(t => <option key={t.id} value={t.name} />)}
      </datalist>
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-8 bg-app-bg shrink-0">
        <div className="flex items-center gap-3">
          {/* Hamburger button on mobile */}
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 text-text-muted hover:text-text-main hover:bg-border rounded-md transition-colors"
            title="Open Sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <u className="text-xs sm:text-sm font-semibold text-text-main capitalize truncate max-w-[150px] sm:max-w-none no-underline">
            {title}
          </u>
        </div>

        {/* Responsive Mobile / Tablet toggler */}
        <div className="xl:hidden flex items-center bg-border/40 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setMobileActiveView('form')}
            className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
              mobileActiveView === 'form'
                ? 'bg-text-main text-app-bg shadow-xs'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Configure
          </button>
          <button
            onClick={() => setMobileActiveView('output')}
            className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
              mobileActiveView === 'output'
                ? 'bg-text-main text-app-bg shadow-xs'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Script Output
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex-1 p-4 sm:p-8 overflow-y-auto space-y-8 bg-app-bg border-r border-border transition-all duration-200 ${
          mobileActiveView === 'form' ? 'block' : 'hidden xl:block'
        }`}>
          {activeTab === 'interfaces' && <InterfacesForm />}
          {activeTab === 'bridge' && <BridgeForm />}
          {activeTab === 'ip' && <IPForm />}
          {activeTab === 'ppp' && <PPPoEForm />}
          {activeTab === 'routing' && <TunnelsForm />}
          {activeTab === 'queues' && <QueuesForm />}
          {activeTab === 'tools' && <ToolsForm />}
        </div>
        <div className={`transition-all duration-200 ${
          mobileActiveView === 'output' ? 'w-full block' : 'hidden xl:block'
        }`}>
          <OutputPanel />
        </div>
      </div>
      
      <footer className="h-8 bg-sidebar-bg border-t border-border px-4 sm:px-8 flex items-center justify-between text-[8px] sm:text-[10px] text-text-muted font-bold uppercase tracking-wider sm:tracking-widest shrink-0">
        <div className="flex gap-4 sm:gap-6">
          <span>System: Online</span>
          <span className="hidden sm:inline">Valid Syntax: OK</span>
        </div>
        <span>Secure Local Generation Only</span>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen w-full bg-app-bg text-text-main font-sans antialiased overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}
