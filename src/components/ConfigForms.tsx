import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useAppContext } from '../store';

function FormSection({ title, children, showClearAll, onClearAll }: { title: string, children: React.ReactNode, showClearAll?: boolean, onClearAll?: () => void }) {
  return (
    <div className="space-y-4 pt-4 border-t border-border first:border-t-0 first:pt-0 pb-8 last:pb-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-text-main">{title}</h3>
        {showClearAll && onClearAll && (
          <button 
            onClick={onClearAll} 
            className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', list }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string, list?: string }) {
  return (
    <div className="flex-1 min-w-[200px] space-y-2">
      <label className="block text-[11px] uppercase tracking-wider text-text-muted font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        className="w-full bg-input-bg border border-border hover:border-border-hover rounded-md px-4 py-2 text-sm focus:outline-none focus:border-brand-color focus:ring-1 focus:ring-brand-color/20 text-text-main transition-colors placeholder:text-text-muted/50"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: {label: string, value: string}[] }) {
  return (
    <div className="flex-1 min-w-[200px] space-y-2">
      <label className="block text-[11px] uppercase tracking-wider text-text-muted font-bold">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-input-bg border border-border hover:border-border-hover rounded-md px-4 py-2 text-sm cursor-pointer focus:outline-none focus:border-brand-color focus:ring-1 focus:ring-brand-color/20 text-text-main transition-colors"
      >
        <option value="" disabled>Select option</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`w-10 h-5 rounded-full relative transition-[background-color,border-color] ${checked ? 'bg-brand-color/20 border border-brand-color/30' : 'bg-border/50 border border-transparent'}`}>
        <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-[left,box-shadow,background-color] ${checked ? 'left-5 bg-brand-color shadow-[0_0_8px_var(--color-brand)]' : 'left-1 bg-text-muted/70'}`}></div>
      </div>
      <span className="text-xs text-text-muted">{label}</span>
    </label>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="pb-1">
      <button onClick={onClick} className="p-2 text-text-muted hover:text-red-500 transition-colors bg-border/30 rounded-md hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function AddBtn({ onClick, text }: { onClick: () => void, text: string }) {
  return (
     <button onClick={onClick} className="px-4 py-2 bg-border/30 hover:bg-border/60 w-fit text-xs rounded-md border border-border hover:border-border-hover transition-colors flex items-center gap-2 text-text-muted hover:text-text-main font-medium shadow-sm">
       <Plus size={14} /> {text}
     </button>
  );
}

export function InterfacesForm() {
  const { state, setState, updateItem, addItem, removeItem, activeSubTab } = useAppContext();

  if (activeSubTab === 'tunnels') {
    return (
      <div className="animate-in fade-in duration-300">
        <FormSection title="EoIP Tunnels" showClearAll={state.eoipTunnels.length > 0} onClearAll={() => setState(s => ({ ...s, eoipTunnels: [] }))}>
          {state.eoipTunnels.map(tunnel => (
            <div key={tunnel.id} className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
              <Input label="Name" value={tunnel.name} onChange={v => updateItem('eoipTunnels', tunnel.id, { name: v })} placeholder="e.g. eoip-tunnel1" />
              <Input label="Remote Address" value={tunnel.remoteAddress} onChange={v => updateItem('eoipTunnels', tunnel.id, { remoteAddress: v })} placeholder="Public IP" />
              <Input label="Tunnel ID" value={tunnel.tunnelId} onChange={v => updateItem('eoipTunnels', tunnel.id, { tunnelId: v })} placeholder="e.g. 10" type="number" />
              <RemoveBtn onClick={() => removeItem('eoipTunnels', tunnel.id)} />
            </div>
          ))}
          <AddBtn onClick={() => addItem('eoipTunnels', { name: '', remoteAddress: '', tunnelId: '' })} text="Add EoIP Tunnel" />
        </FormSection>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="VLANs" showClearAll={state.vlans.length > 0} onClearAll={() => setState(s => ({ ...s, vlans: [] }))}>
        {state.vlans.map(vlan => (
          <div key={vlan.id} className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
            <Input label="VLAN Name" value={vlan.name} onChange={v => updateItem('vlans', vlan.id, { name: v })} placeholder="e.g. vlan10-mgmt" />
            <Input label="VLAN ID (1-4094)" value={vlan.vlanId} onChange={v => updateItem('vlans', vlan.id, { vlanId: v })} placeholder="e.g. 10" type="number" />
            <Input label="Parent Interface" value={vlan.interface} onChange={v => updateItem('vlans', vlan.id, { interface: v })} placeholder="e.g. ether1 or bridge1" />
            <RemoveBtn onClick={() => removeItem('vlans', vlan.id)} />
          </div>
        ))}
        <AddBtn onClick={() => addItem('vlans', { name: '', vlanId: '', interface: '' })} text="Add VLAN" />
      </FormSection>
    </div>
  );
}

export function BridgeForm() {
  const { state, setState, updateItem, addItem, removeItem } = useAppContext();

  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="Bridges" showClearAll={state.bridges.length > 0} onClearAll={() => setState(s => ({ ...s, bridges: [] }))}>
        {state.bridges.map(bridge => (
          <div key={bridge.id} className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
            <Input label="Bridge Name" value={bridge.name} onChange={v => updateItem('bridges', bridge.id, { name: v })} placeholder="e.g. bridge1" />
            <Input label="Ports (Comma separated)" value={bridge.ports} onChange={v => updateItem('bridges', bridge.id, { ports: v })} placeholder="e.g. ether1, ether2" />
            <RemoveBtn onClick={() => removeItem('bridges', bridge.id)} />
          </div>
        ))}
        <AddBtn onClick={() => addItem('bridges', { name: '', ports: '' })} text="Add Bridge" />
      </FormSection>
    </div>
  );
}

function ipToInt(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function intToIp(int: number): string {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

function calculatePoolRange(networkIp: string, cidrString: string): string {
    if (!networkIp || !cidrString) return '';
    try {
        const cidrMatch = cidrString.match(/\d+/);
        if (!cidrMatch) return '';
        const cidr = parseInt(cidrMatch[0], 10);
        if (isNaN(cidr) || cidr < 8 || cidr > 30) return '';
        
        const parts = networkIp.split('.');
        if (parts.length !== 4) return '';
        
        const ipInt = ipToInt(networkIp);
        const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
        const network = (ipInt & mask) >>> 0;
        const broadcast = (network | (~mask)) >>> 0;
        
        const firstUsable = network + 2; // +1 is usually gateway
        const lastUsable = broadcast - 1;
        
        if (firstUsable > lastUsable) return "";

        return `${intToIp(firstUsable)}-${intToIp(lastUsable)}`;
    } catch {
       return '';
    }
}

export function IPForm() {
  const { state, setState, updateItem, addItem, removeItem, activeSubTab } = useAppContext();

  // Auto-calculate IP pools
  React.useEffect(() => {
    if (!state.poolSettings.masterNetwork || !state.poolSettings.poolCidr) return;
    const cidr = parseInt(state.poolSettings.poolCidr.match(/\d+/)?.[0] || '0', 10);
    if (isNaN(cidr) || cidr < 8 || cidr > 30) return;

    const parts = state.poolSettings.masterNetwork.split('.');
    if (parts.length !== 4) return;
    
    let baseIpInt = ipToInt(state.poolSettings.masterNetwork);
    const poolHosts = Math.pow(2, 32 - cidr);
    
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;

    let changed = false;
    const newPools = state.ipPools.map((pool, idx) => {
        const networkInt = baseIpInt + (idx * poolHosts);
        const network = (networkInt & mask) >>> 0;
        const broadcast = (network | (~mask)) >>> 0;
        
        const firstUsable = network + 2; 
        const lastUsable = broadcast - 1;
        
        let newRange = '';
        if (firstUsable <= lastUsable) {
           newRange = `${intToIp(firstUsable)}-${intToIp(lastUsable)}`;
        }
        if (pool.ranges !== newRange) changed = true;
        return { ...pool, ranges: newRange };
    });

    if (changed) {
        setState(s => ({ ...s, ipPools: newPools }));
    }
  }, [state.poolSettings.masterNetwork, state.poolSettings.poolCidr, state.ipPools.length, state.ipPools]);

  if (activeSubTab === 'dns') {
    return (
      <div className="animate-in fade-in duration-300">
        <FormSection title="DNS Settings">
          <div className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
            <Input label="Primary DNS" value={state.dns.primary} onChange={v => setState(s => ({ ...s, dns: { ...s.dns, primary: v } }))} placeholder="8.8.8.8" />
            <Input label="Secondary DNS" value={state.dns.secondary} onChange={v => setState(s => ({ ...s, dns: { ...s.dns, secondary: v } }))} placeholder="8.8.4.4" />
            <div className="pb-2">
              <Toggle label="Allow Remote Requests" checked={state.dns.allowRemoteRequests} onChange={c => setState(s => ({ ...s, dns: { ...s.dns, allowRemoteRequests: c } }))} />
            </div>
          </div>
        </FormSection>
      </div>
    );
  }

  if (activeSubTab === 'pool') {
    return (
      <div className="animate-in fade-in duration-300">
        <FormSection title="IP Pools" showClearAll={state.ipPools.length > 0} onClearAll={() => setState(s => ({ ...s, ipPools: [] }))}>
           <div className="mb-6 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
             <h4 className="text-xs font-bold text-cyan-400 mb-4 block">Auto Pool Generator (Global Subnet)</h4>
             <div className="flex flex-wrap items-end gap-6">
               <Input 
                 label="Master Network IP" 
                 value={state.poolSettings?.masterNetwork || ''} 
                 onChange={v => setState(s => ({...s, poolSettings: { ...s.poolSettings, masterNetwork: v }}))} 
                 placeholder="e.g. 10.10.10.0" 
               />
               <Input 
                 label="CIDR Size per Pool" 
                 value={state.poolSettings?.poolCidr || ''} 
                 onChange={v => setState(s => ({...s, poolSettings: { ...s.poolSettings, poolCidr: v }}))} 
                 placeholder="e.g. 21" 
               />
             </div>
           </div>

           {state.ipPools.map((pool, idx) => (
             <div key={pool.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg">
               <div className="flex flex-wrap items-end gap-6">
                 <div className="text-xs font-mono text-slate-500 pb-2">#{idx + 1}</div>
                 <Input label="Package Name" value={pool.name} onChange={v => updateItem('ipPools', pool.id, { name: v })} placeholder="e.g. Package-5Mbps" />
                 <Input label="Generated Ranges" value={pool.ranges} onChange={v => updateItem('ipPools', pool.id, { ranges: v })} placeholder="Auto-calculated" />
                 <RemoveBtn onClick={() => removeItem('ipPools', pool.id)} />
               </div>
             </div>
          ))}
          <AddBtn onClick={() => addItem('ipPools', { name: '', ranges: '' })} text="Add Pool" />
        </FormSection>
      </div>
    );
  }

  if (activeSubTab === 'firewall') {
    return <FirewallForm />;
  }

  // address fallback
  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="IP Addresses" showClearAll={state.ipAddresses.length > 0} onClearAll={() => setState(s => ({ ...s, ipAddresses: [] }))}>
        {state.ipAddresses.map(ip => (
          <div key={ip.id} className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
            <Input label="IP Address (CIDR)" value={ip.address} onChange={v => updateItem('ipAddresses', ip.id, { address: v })} placeholder="e.g. 192.168.88.1/24" />
            <Input label="Interface" value={ip.interface} onChange={v => updateItem('ipAddresses', ip.id, { interface: v })} placeholder="e.g. bridge1" />
            <RemoveBtn onClick={() => removeItem('ipAddresses', ip.id)} />
          </div>
        ))}
        <AddBtn onClick={() => addItem('ipAddresses', { address: '', interface: '' })} text="Add IP Address" />
      </FormSection>
    </div>
  );
}

export function FirewallForm() {
  const { state, setState, updateItem, addItem, removeItem } = useAppContext();

  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="Source NAT" showClearAll={state.srcNat.length > 0} onClearAll={() => setState(s => ({ ...s, srcNat: [] }))}>
         {state.srcNat.map(nat => (
          <div key={nat.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg">
            <div className="flex flex-wrap items-end gap-6">
              <Select label="Action" value={nat.action} onChange={v => updateItem('srcNat', nat.id, { action: v })} options={[{label:'masquerade', value:'masquerade'}, {label:'src-nat', value:'src-nat'}, {label:'accept', value:'accept'}]} />
              <Input label="Out Interface" value={nat.outInterface} onChange={v => updateItem('srcNat', nat.id, { outInterface: v })} placeholder="e.g. ether1" />
              <Input label="Src. Address" value={nat.srcAddress || ''} onChange={v => updateItem('srcNat', nat.id, { srcAddress: v })} placeholder="e.g. 192.168.88.0/24 (Opt)" />
              <Input label="Src. Address List" value={nat.srcAddressList || ''} onChange={v => updateItem('srcNat', nat.id, { srcAddressList: v })} placeholder="e.g. !Public-IP" />
              <RemoveBtn onClick={() => removeItem('srcNat', nat.id)} />
            </div>
            <div className="flex items-center pt-2">
              <Toggle label="Disabled" checked={nat.disabled || false} onChange={c => updateItem('srcNat', nat.id, { disabled: c })} />
            </div>
            {nat.action === 'src-nat' && (
              <div className="flex flex-wrap items-end gap-6 bg-cyan-500/5 p-4 rounded-md border border-cyan-500/10">
                 <Input label="To Addresses (Required for src-nat)" value={nat.toAddresses} onChange={v => updateItem('srcNat', nat.id, { toAddresses: v })} placeholder="e.g. 1.1.1.1/30" />
              </div>
            )}
          </div>
        ))}
        <AddBtn onClick={() => addItem('srcNat', { action: 'masquerade', outInterface: '', srcAddress: '', srcAddressList: '', toAddresses: '', disabled: false })} text="Add Source NAT" />
      </FormSection>

      <FormSection title="Destination NAT" showClearAll={state.dstNat.length > 0} onClearAll={() => setState(s => ({ ...s, dstNat: [] }))}>
        {state.dstNat.map(nat => (
          <div key={nat.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg">
            <div className="flex flex-wrap items-end gap-6">
              <Select label="Action" value={nat.action} onChange={v => updateItem('dstNat', nat.id, { action: v })} options={[{label:'dst-nat', value:'dst-nat'}, {label:'accept', value:'accept'}]} />
              <Select label="Protocol" value={nat.protocol} onChange={v => updateItem('dstNat', nat.id, { protocol: v })} options={[{label:'tcp', value:'tcp'}, {label:'udp', value:'udp'}]} />
              <Input label="Dst. Port" value={nat.dstPort} onChange={v => updateItem('dstNat', nat.id, { dstPort: v })} placeholder="e.g. 80" />
              <Input label="In Interface" value={nat.inInterface} onChange={v => updateItem('dstNat', nat.id, { inInterface: v })} placeholder="e.g. ether1" />
              <RemoveBtn onClick={() => removeItem('dstNat', nat.id)} />
            </div>
            {nat.action === 'dst-nat' && (
              <div className="flex flex-wrap items-end gap-6 bg-cyan-500/5 p-4 rounded-md border border-cyan-500/10">
                 <Input label="To Addresses" value={nat.toAddresses} onChange={v => updateItem('dstNat', nat.id, { toAddresses: v })} placeholder="e.g. 192.168.88.10" />
                 <Input label="To Ports (Optional)" value={nat.toPorts} onChange={v => updateItem('dstNat', nat.id, { toPorts: v })} placeholder="e.g. 8080" />
              </div>
            )}
          </div>
        ))}
        <AddBtn onClick={() => addItem('dstNat', { action: 'dst-nat', protocol: 'tcp', dstPort: '', inInterface: '', toAddresses: '', toPorts: '' })} text="Add Destination NAT" />
      </FormSection>
    </div>
  );
}

export function QueuesForm() {
  const { state, setState, updateItem, addItem, removeItem } = useAppContext();

  const pcqTypes = (state.queueTypes || []).filter(qt => qt.kind === 'pcq').map(qt => ({ label: qt.name || 'Unnamed PCQ', value: qt.name }));
  const queueOptions = [{ label: 'default', value: 'default' }, ...pcqTypes];

  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="Queue Types (PCQ)" showClearAll={(state.queueTypes || []).length > 0} onClearAll={() => setState(s => ({ ...s, queueTypes: [] }))}>
        {(state.queueTypes || []).map(qt => (
          <div key={qt.id} className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
            <Input label="Name" value={qt.name} onChange={v => updateItem('queueTypes', qt.id, { name: v })} placeholder="e.g. pcq-down" />
            <Input label="Rate" value={qt.pcqRate} onChange={v => updateItem('queueTypes', qt.id, { pcqRate: v })} placeholder="e.g. 5M or 0" />
            <Input label="Total Limit" value={qt.pcqTotalLimit || ''} onChange={v => updateItem('queueTypes', qt.id, { pcqTotalLimit: v })} placeholder="e.g. 75000KiB" />
            <Select 
              label="Classifier" 
              value={qt.pcqClassifier} 
              onChange={v => updateItem('queueTypes', qt.id, { pcqClassifier: v })} 
              options={[
                { label: 'src-address', value: 'src-address' },
                { label: 'dst-address', value: 'dst-address' },
                { label: 'src-address,dst-address', value: 'src-address,dst-address' },
              ]} 
            />
            <RemoveBtn onClick={() => removeItem('queueTypes', qt.id)} />
          </div>
        ))}
        <AddBtn onClick={() => addItem('queueTypes', { name: '', kind: 'pcq', pcqRate: '0', pcqTotalLimit: '', pcqClassifier: 'dst-address' })} text="Add PCQ Type" />
      </FormSection>

      <FormSection title="Simple Queues" showClearAll={state.queues.length > 0} onClearAll={() => setState(s => ({ ...s, queues: [] }))}>
        {state.queues.map(queue => (
          <div key={queue.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg">
            <div className="flex flex-wrap items-end gap-6">
              <Input label="Name" value={queue.name} onChange={v => updateItem('queues', queue.id, { name: v })} placeholder="e.g. client1" />
              <Input label="Target" value={queue.target} onChange={v => updateItem('queues', queue.id, { target: v })} placeholder="e.g. 10.11.8.0/21" />
              <Input label="Dst" value={queue.dst || ''} onChange={v => updateItem('queues', queue.id, { dst: v })} placeholder="e.g. 01-IIG- DHK-ASR-131" />
              <RemoveBtn onClick={() => removeItem('queues', queue.id)} />
            </div>
            <div className="flex items-center py-1">
              <Toggle label="Disabled" checked={queue.disabled || false} onChange={c => updateItem('queues', queue.id, { disabled: c })} />
            </div>
            <div className="flex flex-wrap items-end gap-6 bg-cyan-500/5 p-4 rounded-md border border-cyan-500/10">
              <Input label="Max Limit (Up/Down)" value={queue.maxLimit} onChange={v => updateItem('queues', queue.id, { maxLimit: v })} placeholder="e.g. 10M/10M" />
              <Select label="Queue Type (Upload)" value={queue.queueTypeUpload || 'default'} onChange={v => updateItem('queues', queue.id, { queueTypeUpload: v })} options={queueOptions} />
              <Select label="Queue Type (Download)" value={queue.queueTypeDownload || 'default'} onChange={v => updateItem('queues', queue.id, { queueTypeDownload: v })} options={queueOptions} />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => addItem('queues', { name: '', target: '', dst: '', maxLimit: '', queueTypeUpload: 'default', queueTypeDownload: 'default', disabled: false })} text="Add Simple Queue" />
      </FormSection>
    </div>
  );
}

export function PPPoEForm() {
  const { state, setState, updateItem, addItem, removeItem, activeSubTab } = useAppContext();

  const handleProfileNameChange = (id: string, name: string) => {
    const pool = state.ipPools.find(p => p.name === name);
    if (pool && pool.name) {
      let localAddress = '';
      if (pool.ranges) {
        const firstIp = pool.ranges.split('-')[0];
        if (firstIp) {
            try {
                localAddress = intToIp(ipToInt(firstIp) - 1);
            } catch (e) {}
        }
      }
      updateItem('pppoeProfiles', id, { 
        name, 
        localAddress,
        remoteAddress: pool.name 
      });
    } else {
      updateItem('pppoeProfiles', id, { name });
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <datalist id="ip-pools">
        {state.ipPools.map(p => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>
      <datalist id="pppoe-profiles">
        {state.pppoeProfiles.map(p => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>

      {activeSubTab === 'servers' && (
        <FormSection title="PPPoE Servers" showClearAll={(state.pppoeServers || []).length > 0} onClearAll={() => setState(s => ({ ...s, pppoeServers: [] }))}>
          {(state.pppoeServers || []).map(srv => (
            <div key={srv.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg">
               <div className="flex flex-wrap items-end gap-6">
                 <Input label="Service Name" value={srv.serviceName || ''} onChange={v => updateItem('pppoeServers', srv.id, { serviceName: v })} placeholder="e.g. service31" />
                 <Input label="Interface" value={srv.interface || ''} onChange={v => updateItem('pppoeServers', srv.id, { interface: v })} placeholder="e.g. bridge1" />
                 <Input label="Keepalive Timeout" value={srv.keepalive || '10'} onChange={v => updateItem('pppoeServers', srv.id, { keepalive: v })} placeholder="10" />
                 <RemoveBtn onClick={() => removeItem('pppoeServers', srv.id)} />
               </div>
               <div className="flex items-center pt-1">
                 <Toggle label="Disabled" checked={srv.disabled || false} onChange={c => updateItem('pppoeServers', srv.id, { disabled: c })} />
               </div>
               <div className="flex flex-wrap items-end gap-6 bg-cyan-500/5 p-4 rounded-md border border-cyan-500/10">
                 <Input label="Default Profile" value={srv.defaultProfile || 'default'} onChange={v => updateItem('pppoeServers', srv.id, { defaultProfile: v })} placeholder="default" list="pppoe-profiles" />
                 <div className="flex-1 min-w-[200px] mb-2">
                   <Toggle label="One Session Per Host" checked={srv.oneSessionPerHost || false} onChange={c => updateItem('pppoeServers', srv.id, { oneSessionPerHost: c })} />
                 </div>
                 <Input label="Authentication" value={srv.authentication || 'pap,chap,mschap1,mschap2'} onChange={v => updateItem('pppoeServers', srv.id, { authentication: v })} placeholder="e.g. pap" />
               </div>
            </div>
          ))}
          <AddBtn onClick={() => addItem('pppoeServers', { serviceName: '', interface: '', keepalive: '10', defaultProfile: 'default', disabled: false, oneSessionPerHost: false, authentication: 'pap,chap,mschap1,mschap2' })} text="Add PPPoE Server" />
        </FormSection>
      )}

      {activeSubTab === 'profiles' && (
        <FormSection title="Profiles" showClearAll={state.pppoeProfiles.length > 0} onClearAll={() => setState(s => ({ ...s, pppoeProfiles: [] }))}>
           {state.pppoeProfiles.map(profile => (
            <div key={profile.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg">
               <div className="flex flex-wrap items-end gap-6">
                <Input label="Profile Name" value={profile.name} onChange={v => handleProfileNameChange(profile.id, v)} placeholder="e.g. Package-5Mbps" list="ip-pools" />
                <Input label="Local Address" value={profile.localAddress} onChange={v => updateItem('pppoeProfiles', profile.id, { localAddress: v })} placeholder="IP or Pool name" list="ip-pools" />
                <Input label="Remote Address" value={profile.remoteAddress} onChange={v => updateItem('pppoeProfiles', profile.id, { remoteAddress: v })} placeholder="IP or Pool name" list="ip-pools" />
                <RemoveBtn onClick={() => removeItem('pppoeProfiles', profile.id)} />
              </div>
              <div className="flex flex-wrap items-end gap-6 bg-cyan-500/5 p-4 rounded-md border border-cyan-500/10">
                <Input label="Primary DNS" value={profile.dnsServer} onChange={v => updateItem('pppoeProfiles', profile.id, { dnsServer: v })} placeholder="8.8.8.8" />
                <Input label="Secondary DNS" value={profile.dnsServer2 || ''} onChange={v => updateItem('pppoeProfiles', profile.id, { dnsServer2: v })} placeholder="1.1.1.1" />
                <Input label="Rate Limit" value={profile.rateLimit} onChange={v => updateItem('pppoeProfiles', profile.id, { rateLimit: v })} placeholder="e.g. 50M/50M" />
                <Select label="Only One" value={profile.onlyOne || 'default'} onChange={v => updateItem('pppoeProfiles', profile.id, { onlyOne: v })} options={[{label: 'default', value: 'default'}, {label: 'yes', value: 'yes'}, {label: 'no', value: 'no'}]} />
              </div>
            </div>
          ))}
          <AddBtn onClick={() => addItem('pppoeProfiles', { name: '', localAddress: '', remoteAddress: '', dnsServer: '', dnsServer2: '', rateLimit: '', onlyOne: 'default' })} text="Add Profile" />
        </FormSection>
      )}

      {activeSubTab === 'secrets' && (
        <FormSection title="Secrets (Users)" showClearAll={state.pppoeSecrets.length > 0} onClearAll={() => setState(s => ({ ...s, pppoeSecrets: [] }))}>
           {state.pppoeSecrets.map(secret => (
            <div key={secret.id} className="flex flex-wrap items-end gap-6 p-4 rounded-lg border border-border bg-panel-bg">
              <Input label="Username" value={secret.name} onChange={v => updateItem('pppoeSecrets', secret.id, { name: v })} placeholder="user1" />
              <Input label="Password" value={secret.password} onChange={v => updateItem('pppoeSecrets', secret.id, { password: v })} placeholder="secret password" />
              <Input label="Profile" value={secret.profile} onChange={v => updateItem('pppoeSecrets', secret.id, { profile: v })} placeholder="default or custom" list="pppoe-profiles" />
              <RemoveBtn onClick={() => removeItem('pppoeSecrets', secret.id)} />
            </div>
          ))}
          <AddBtn onClick={() => addItem('pppoeSecrets', { name: '', password: '', profile: '' })} text="Add Secret" />
        </FormSection>
      )}
    </div>
  );
}

export function TunnelsForm() {
  const { state, setState, updateItem, addItem, removeItem, activeSubTab } = useAppContext();

  const updateBgpTemplate = (id: string, data: any) => {
    setState(s => ({
      ...s,
      bgp: {
        ...s.bgp,
        templates: (s.bgp.templates || []).map(t => t.id === id ? { ...t, ...data } : t)
      }
    }));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="BGP Routing" showClearAll={state.bgp.peers.length > 0 || (state.bgp.templates || []).length > 0} onClearAll={() => setState(s => ({ ...s, bgp: { ...s.bgp, peers: [], templates: [] } }))}>
        <div className="flex items-center justify-between text-[11px] mb-4 p-4 rounded-lg border border-border bg-panel-bg">
           <span className="text-slate-500 font-bold uppercase tracking-wider">OS Target Variant</span>
           <div className="flex gap-1">
             <button 
               onClick={() => setState(s => ({ ...s, bgp: { ...s.bgp, routerOsVersion: 'v6' } }))}
               className={`px-3 py-1 rounded text-xs transition-all ${state.bgp.routerOsVersion === 'v6' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
             >v6</button>
             <button 
               onClick={() => setState(s => ({ ...s, bgp: { ...s.bgp, routerOsVersion: 'v7' } }))}
               className={`px-3 py-1 rounded text-xs transition-all ${state.bgp.routerOsVersion === 'v7' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
             >v7</button>
           </div>
        </div>

        {state.bgp.routerOsVersion === 'v7' && (
          <div className="mb-8">
            <h4 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-3">Templates (v7)</h4>
            {(state.bgp.templates || []).map(tmpl => (
              <div key={tmpl.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border mb-4 bg-panel-bg">
                 <div className="flex flex-wrap items-end gap-6">
                    <Input label="Name" value={tmpl.name || ''} onChange={v => updateBgpTemplate(tmpl.id, { name: v })} placeholder="e.g. CACHE" />
                    <Input label="Local AS" value={tmpl.as || ''} onChange={v => updateBgpTemplate(tmpl.id, { as: v })} type="number" placeholder="e.g. 64519" />
                    <Input label="Router ID" value={tmpl.routerId || ''} onChange={v => updateBgpTemplate(tmpl.id, { routerId: v })} placeholder="e.g. 10.117.11.70" />
                    <RemoveBtn onClick={() => setState(s => ({ ...s, bgp: { ...s.bgp, templates: s.bgp.templates.filter(t => t.id !== tmpl.id) } }))} />
                 </div>
                 <div className="pt-2">
                    <Toggle label="Disabled" checked={tmpl.disabled || false} onChange={c => updateBgpTemplate(tmpl.id, { disabled: c })} />
                 </div>
              </div>
            ))}
            <AddBtn onClick={() => setState(s => ({ ...s, bgp: { ...s.bgp, templates: [...(s.bgp.templates || []), { id: crypto.randomUUID(), name: '', as: '', routerId: '', disabled: false }] } }))} text="Add Template" />
          </div>
        )}

        {state.bgp.peers.map(peer => (
          <div key={peer.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-panel-bg mt-4">
             <div className="flex flex-wrap items-end gap-6">
                <Input label="Name" value={peer.name || ''} onChange={v => updateItem('bgp', peer.id, { name: v })} placeholder="e.g. BDIX" />
                <Select label="Type" value={peer.type} onChange={v => updateItem('bgp', peer.id, { type: v as any })} options={[{label:'iBGP', value:'iBGP'}, {label:'eBGP', value:'eBGP'}]} />
                <Input label="Local AS" value={peer.as || ''} onChange={v => updateItem('bgp', peer.id, { as: v })} placeholder="e.g. 64519" type="number" />
                <Input label="Remote AS" value={peer.remoteAs} onChange={v => updateItem('bgp', peer.id, { remoteAs: v })} placeholder="e.g. 65532" type="number" />
                <Input label="Peer Address" value={peer.peerAddress || ''} onChange={v => updateItem('bgp', peer.id, { peerAddress: v })} placeholder="IP Address" />
                <RemoveBtn onClick={() => removeItem('bgp', peer.id)} />
             </div>
             
             <div className="flex flex-wrap items-end gap-6">
                {state.bgp.routerOsVersion === 'v7' && (
                  <Select label="Template" value={peer.template || ''} onChange={v => updateItem('bgp', peer.id, { template: v })} options={[{ label: 'None', value: '' }, ...(state.bgp.templates || []).map(t => ({ label: t.name, value: t.name }))]} />
                )}
                {state.bgp.routerOsVersion === 'v7' && <Input label="Router ID" value={peer.routerId || ''} onChange={v => updateItem('bgp', peer.id, { routerId: v })} placeholder="e.g. 10.117.11.70" />}
                {state.bgp.routerOsVersion === 'v7' && <Input label="Routing Table" value={peer.routingTable || ''} onChange={v => updateItem('bgp', peer.id, { routingTable: v })} placeholder="e.g. main" />}
                {state.bgp.routerOsVersion === 'v7' && <Input label="Input Filter" value={peer.inputFilter || ''} onChange={v => updateItem('bgp', peer.id, { inputFilter: v })} placeholder="e.g. BDIX_IN" />}
                {state.bgp.routerOsVersion === 'v7' && <Input label="Output Filter Chain" value={peer.outputFilterChain || ''} onChange={v => updateItem('bgp', peer.id, { outputFilterChain: v })} placeholder="e.g. BGP PEER" />}
                {state.bgp.routerOsVersion === 'v7' && <Input label="Output Network" value={peer.outputNetwork || ''} onChange={v => updateItem('bgp', peer.id, { outputNetwork: v })} placeholder="e.g. BGP PEER" />}
             </div>

             <div className="flex items-center gap-6 pb-1 pt-2">
                <Toggle label="Disabled" checked={peer.disabled || false} onChange={c => updateItem('bgp', peer.id, { disabled: c })} />
                <Toggle label="Allow / eBGP Multihop" checked={peer.multihop} onChange={c => updateItem('bgp', peer.id, { multihop: c })} />
             </div>
          </div>
        ))}
        <div className="mt-4">
          <AddBtn onClick={() => addItem('bgp', { name: '', type: 'eBGP', template: '', as: '', remoteAs: '', peerAddress: '', multihop: false, routerId: '', inputFilter: '', outputFilterChain: '', outputNetwork: '', routingTable: '', disabled: false })} text="Add BGP Peer" />
        </div>
      </FormSection>
    </div>
  );
}

export function ToolsForm() {
  const [input, setInput] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  
  const parsedResult = React.useMemo(() => {
    if (!input.trim()) return { text: '', count: 0 };
    const commands: string[] = [];
    const lines = input.split('\n');
    let headers: string[] = [];

    // Auto-detect context
    const txt = input.toLowerCase();
    let migrationType = 'generic';
    let contextPrefix = '';
    
    if (txt.includes('service=') || txt.includes('password=') || txt.includes('profile=') || txt.match(/\bpppoe\b/)) {
        migrationType = 'pppoe-secrets';
        contextPrefix = '/ppp secret\n';
    } else if (txt.includes('target=') || txt.includes('max-limit=') || txt.match(/\bqueue\b/)) {
        migrationType = 'queues';
        contextPrefix = '/queue simple\n';
    } else if (txt.includes('network=') || txt.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}\b/)) {
        migrationType = 'ip-addresses';
        contextPrefix = '/ip address\n';
    } else if (txt.includes('mac-address=') || txt.match(/\bdhcp\b/)) {
        migrationType = 'dhcp-leases';
        contextPrefix = '/ip dhcp-server lease\n';
    }

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.startsWith('Flags:') || line.startsWith('#') || line.match(/^[A-Z\s]+$/)) continue;

        // Key=Value Detail Mode (Winbox/Terminal "print detail" or "export")
        if (line.includes('name=') || line.includes('address=') || line.includes('target=') || line.includes('mac-address=')) {
           // Remove prefix like " 0  X "
           let cleanLine = line.replace(/^\s*\d*\s*(?:\s*[XIDR\*\s]+\s+)?/, '').trim();
           // In case it's an export format, strip "add " or "set " to normalize
           cleanLine = cleanLine.replace(/^(add|set)\s+/, '');
           if (cleanLine) commands.push(`add ${cleanLine}`);
           continue;
        }

        // Tab Separated Mode (Winbox Copy)
        if (line.includes('\t')) {
            const parts = line.split('\t').map(p => p.replace(/(^"|"$)/g, '').trim());
            
            // Check headers
            if (headers.length === 0) {
               const looksLikeHeader = parts.some(p => ['Name', 'Target', 'Address', 'Service', 'Password', 'MAC Address', 'Network', 'Interface'].includes(p));
               if (looksLikeHeader) {
                   headers = parts.map(h => h.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''));
                   continue;
               }
            }
            
            if (headers.length > 0) {
               let cmd = `add`;
               parts.forEach((val, idx) => {
                  if (val && headers[idx] && !['', '#', 'flag'].includes(headers[idx])) {
                     cmd += ` ${headers[idx]}="${val}"`;
                  }
               });
               commands.push(cmd);
               continue;
            } else {
               // Fallback Tab Parsing
               if (migrationType === 'pppoe-secrets' && parts.length >= 4) {
                   let cmd = `add name="${parts[0]}"`;
                   if (parts[1]) cmd += ` service="${parts[1]}"`;
                   if (parts[3]) cmd += ` password="${parts[3]}"`;
                   if (parts[4]) cmd += ` profile="${parts[4]}"`;
                   commands.push(cmd);
               } else if (migrationType === 'ip-addresses' && parts.length >= 2) {
                   let cmd = `add address="${parts[0]}" network="${parts[1]}" interface="${parts[2] || ''}"`;
                   commands.push(cmd);
               } else if (migrationType === 'queues' && parts.length >= 2) {
                   let cmd = `add name="${parts[0]}" target="${parts[1]}"`;
                   commands.push(cmd);
               }
            }
            continue;
        }

        // Space Separated Mode (Terminal standard print)
        let tokens = line.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        if (tokens.length === 0) continue;
        
        let disabled = false;
        // Shift item number
        if (/^(\?|\*)?\d+/.test(tokens[0])) tokens.shift();
        // Shift flags like X, I, D
        while (tokens.length > 0 && /^[XIDRA]+$/.test(tokens[0])) {
           if (tokens[0].includes('X')) disabled = true;
           tokens.shift();
        }
        
        // Basic terminal positional parsing
        if (migrationType === 'pppoe-secrets' && tokens.length >= 3) {
           const name = tokens[0]?.replace(/"/g, '') || '';
           const service = tokens[1]?.replace(/"/g, '') || 'pppoe';
           const password = tokens[2]?.replace(/"/g, '') || '';
           const profile = tokens[3]?.replace(/"/g, '') || 'default';
           
           let cmd = `add name="${name}" password="${password}" profile="${profile}" service="${service}"`;
           if (disabled) cmd += ` disabled=yes`;
           commands.push(cmd);
        } else if (migrationType === 'ip-addresses' && tokens.length >= 3) {
           let cmd = `add address="${tokens[0]}" network="${tokens[1]}" interface="${tokens[2]}"`;
           if (disabled) cmd += ` disabled=yes`;
           commands.push(cmd);
        } else if (migrationType === 'queues' && tokens.length >= 2) {
           let cmd = `add name="${tokens[0]}" target="${tokens[1]}"`;
           if (disabled) cmd += ` disabled=yes`;
           commands.push(cmd);
        }
    }
    
    return { 
      text: commands.length > 0 ? contextPrefix + commands.join('\n') : '', 
      count: commands.length 
    };
  }, [input]);

  const handleCopy = () => {
    if (!parsedResult.text) return;
    navigator.clipboard.writeText(parsedResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <FormSection title="Universal Data Migration Tool">
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-cyan-500/10 bg-panel-bg shadow-lg shadow-black/20">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Print to Export Converter</h4>
              <p className="text-xs text-slate-400">
                Paste data from Winbox (Tab-Separated) or Terminal Print. We'll auto-detect the context and generate clean <code className="text-cyan-400">add ...</code> commands.
              </p>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-6 h-[400px]">
             {/* Input Area */}
             <div className="flex-1 flex flex-col gap-2">
                 <div className="flex items-center justify-between px-1">
                   <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Paste Raw Data</span>
                 </div>
                 <textarea 
                   className="flex-1 bg-input-bg border border-border rounded-md p-4 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-slate-300 resize-none whitespace-pre"
                   placeholder={`Paste from Winbox or Terminal...\n\nWinbox Tips:\n- Copy the headers too for 100% accuracy.\n- Detail mode prints work perfectly.\n\nTerminal Tips:\n- Use "print detail" for best results.`}
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   spellCheck={false}
                 ></textarea>
             </div>
             
             {/* Output Area */}
             <div className="flex-1 flex flex-col gap-2 relative">
                 <div className="flex items-center justify-between px-1">
                   <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Generated Script</span>
                   {parsedResult.count > 0 && (
                     <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                       Extracted {parsedResult.count} items
                     </span>
                   )}
                 </div>
                 <textarea 
                   className="flex-1 bg-[#050507] border border-cyan-500/20 rounded-md p-4 text-xs font-mono text-emerald-400 resize-none selection:bg-cyan-900 selection:text-cyan-100 whitespace-pre shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                   placeholder="Export commands will appear here..."
                   value={parsedResult.text}
                   readOnly
                   spellCheck={false}
                 ></textarea>
                 
                 {parsedResult.text && (
                   <div className="absolute right-4 bottom-4">
                     <button
                       onClick={handleCopy}
                       className={`flex items-center gap-2 px-4 py-2 rounded shadow-lg transition-all ${
                         copied 
                          ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-[0_0_15px_rgba(8,145,178,0.3)]'
                       }`}
                     >
                       {copied ? 'Copied!' : 'Copy Commands'}
                     </button>
                   </div>
                 )}
             </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
