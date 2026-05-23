import { AppState } from './types';

export function generateScript(state: AppState): string {
  const lines: string[] = [];

  const addComment = (text: string) => {
    lines.push('');
    lines.push(`# ${text}`);
  };

  // 1. Interfaces & Bridge
  if (state.bridges.length > 0) {
    addComment('Bridges');
    state.bridges.forEach(b => {
      lines.push(`/interface bridge add name="${b.name}"`);
    });
    
    const bridgePorts = state.bridges.flatMap(b => 
      b.ports.split(',').map(p => p.trim()).filter(Boolean).map(port => ({ bridge: b.name, port }))
    );
    if (bridgePorts.length > 0) {
      addComment('Bridge Ports');
      bridgePorts.forEach(bp => {
        lines.push(`/interface bridge port add bridge="${bp.bridge}" interface="${bp.port}"`);
      });
    }
  }

  if (state.vlans.length > 0) {
    addComment('VLANs');
    state.vlans.forEach(v => {
      lines.push(`/interface vlan add interface="${v.interface}" name="${v.name}" vlan-id=${v.vlanId}`);
    });
  }

  // 2. IP Addressing & Services
  if (state.ipAddresses.length > 0) {
    addComment('IP Addresses');
    state.ipAddresses.forEach(ip => {
      lines.push(`/ip address add address="${ip.address}" interface="${ip.interface}"`);
    });
  }

  if (state.dns.primary || state.dns.secondary) {
    addComment('DNS Configuration');
    const servers = [state.dns.primary, state.dns.secondary].filter(Boolean).join(',');
    const allowRemote = state.dns.allowRemoteRequests ? 'yes' : 'no';
    lines.push(`/ip dns set allow-remote-requests=${allowRemote} servers=${servers}`);
  }

  if (state.ipPools.length > 0) {
    addComment('IP Pools');
    state.ipPools.forEach(p => {
      lines.push(`/ip pool add name="${p.name}" ranges="${p.ranges}"`);
    });
  }

  // 3. Firewall & NAT
  if (state.srcNat.length > 0) {
    addComment('Source NAT');
    state.srcNat.forEach(n => {
      let cmd = `/ip firewall nat add chain=srcnat action=${n.action}`;
      if (n.disabled) cmd += ` disabled=yes`;
      if (n.srcAddress) cmd += ` src-address="${n.srcAddress}"`;
      if (n.srcAddressList) cmd += ` src-address-list="${n.srcAddressList}"`;
      if (n.outInterface) cmd += ` out-interface="${n.outInterface}"`;
      if (n.action === 'src-nat' && n.toAddresses) cmd += ` to-addresses="${n.toAddresses}"`;
      lines.push(cmd);
    });
  }

  if (state.dstNat.length > 0) {
    addComment('Destination NAT');
    state.dstNat.forEach(n => {
      let cmd = `/ip firewall nat add chain=dstnat action=${n.action}`;
      if (n.protocol) cmd += ` protocol=${n.protocol}`;
      if (n.dstPort) cmd += ` dst-port=${n.dstPort}`;
      if (n.inInterface) cmd += ` in-interface="${n.inInterface}"`;
      if (n.action === 'dst-nat' && n.toAddresses) cmd += ` to-addresses="${n.toAddresses}"`;
      if (n.action === 'dst-nat' && n.toPorts) cmd += ` to-ports=${n.toPorts}`;
      lines.push(cmd);
    });
  }

  // 4. Queues
  if (state.queueTypes?.length > 0) {
    addComment('Queue Types (PCQ)');
    state.queueTypes.forEach(qt => {
      if (qt.kind === 'pcq') {
        let cmd = `/queue type add kind=pcq name="${qt.name}" pcq-rate="${qt.pcqRate}" pcq-classifier="${qt.pcqClassifier}"`;
        if (qt.pcqTotalLimit) cmd += ` pcq-total-limit="${qt.pcqTotalLimit}"`;
        lines.push(cmd);
      }
    });
  }

  if (state.queues.length > 0) {
    addComment('Simple Queues');
    state.queues.forEach(q => {
      let cmd = `/queue simple add name="${q.name}"`;
      if (q.disabled) cmd += ` disabled=yes`;
      if (q.target) cmd += ` target="${q.target}"`;
      if (q.dst) cmd += ` dst="${q.dst}"`;
      if (q.maxLimit) cmd += ` max-limit="${q.maxLimit}"`;
      
      const qUp = q.queueTypeUpload || 'default';
      const qDown = q.queueTypeDownload || 'default';
      if (qUp !== 'default' || qDown !== 'default') {
        cmd += ` queue="${qUp}/${qDown}"`;
      }
      lines.push(cmd);
    });
  }

  // 5. PPPoE
  if (state.pppoeProfiles.length > 0) {
    addComment('PPPoE Profiles');
    state.pppoeProfiles.forEach(p => {
      let cmd = `/ppp profile add name="${p.name}"`;
      if (p.localAddress) cmd += ` local-address="${p.localAddress}"`;
      if (p.remoteAddress) cmd += ` remote-address="${p.remoteAddress}"`;
      
      const dnsServers = [p.dnsServer, p.dnsServer2].filter(Boolean).join(',');
      if (dnsServers) cmd += ` dns-server="${dnsServers}"`;
      
      if (p.rateLimit) cmd += ` rate-limit="${p.rateLimit}"`;
      if (p.onlyOne && p.onlyOne !== 'default') cmd += ` only-one="${p.onlyOne}"`;
      lines.push(cmd);
    });
  }

  if (state.pppoeSecrets.length > 0) {
    addComment('PPPoE Secrets');
    state.pppoeSecrets.forEach(s => {
      lines.push(`/ppp secret add name="${s.name}" password="${s.password}" profile="${s.profile}" service=pppoe`);
    });
  }

  if (state.pppoeServers?.length > 0) {
    addComment('PPPoE Servers');
    state.pppoeServers.forEach(srv => {
      let srvCmd = `/interface pppoe-server add service-name="${srv.serviceName}" interface="${srv.interface}" default-profile="${srv.defaultProfile}" keepalive-timeout=${srv.keepalive}`;
      if (srv.disabled) srvCmd += ` disabled=yes`;
      if (srv.oneSessionPerHost) srvCmd += ` one-session-per-host=yes`;
      if (srv.authentication) srvCmd += ` authentication="${srv.authentication}"`;
      lines.push(srvCmd);
    });
  }

  // 6. Tunnels & Routing
  if (state.eoipTunnels.length > 0) {
    addComment('EoIP Tunnels');
    state.eoipTunnels.forEach(t => {
      lines.push(`/interface eoip add name="${t.name}" remote-address="${t.remoteAddress}" tunnel-id=${t.tunnelId}`);
    });
  }

  if (state.bgp.templates?.length > 0 || state.bgp.peers.length > 0) {
    addComment('BGP Configuration');
    
    if (state.bgp.routerOsVersion === 'v7') {
      state.bgp.templates?.forEach(t => {
        let cmd = `/routing bgp template add name="${t.name}"`;
        if (t.as) cmd += ` as=${t.as}`;
        if (t.routerId) cmd += ` router-id=${t.routerId}`;
        if (t.disabled) cmd += ` disabled=yes`;
        lines.push(cmd);
      });

      state.bgp.peers.forEach((p, index) => {
        let cmd = `/routing bgp connection add`;
        if (p.as) cmd += ` as=${p.as}`;
        cmd += p.disabled ? ` disabled=yes` : ` disabled=no`;
        if (p.inputFilter) cmd += ` input.filter="${p.inputFilter}"`;
        cmd += ` local.role=${p.type === 'iBGP' ? 'ibgp' : 'ebgp'}`;
        if (p.name) {
           cmd += ` name="${p.name}"`;
        } else {
           cmd += ` name="peer-${index}"`;
        }
        if (p.outputFilterChain) cmd += ` output.filter-chain="${p.outputFilterChain}"`;
        if (p.outputNetwork) cmd += ` output.network="${p.outputNetwork}"`;
        if (p.peerAddress) cmd += ` remote.address="${p.peerAddress}"`;
        if (p.remoteAs) cmd += ` remote.as=${p.remoteAs}`;
        if (p.routerId) cmd += ` router-id=${p.routerId}`;
        if (p.routingTable) cmd += ` routing-table="${p.routingTable}"`;
        if (p.template) cmd += ` templates="${p.template}"`;
        if (p.multihop) cmd += ` multihop=yes`;
        
        lines.push(cmd);
      });
    } else {
      lines.push(`# RouterOS v6 BGP implementation basic template`);
      const uniqueLocalAs = [...new Set(state.bgp.peers.map(p => p.as).filter(Boolean))];
      if (uniqueLocalAs.length > 0) {
        lines.push(`/routing bgp instance set default as=${uniqueLocalAs[0]}`);
      }
      state.bgp.peers.forEach((p, index) => {
        lines.push(`/routing bgp peer add name="${p.name || `peer-${index}`}" remote-address=${p.peerAddress} remote-as=${p.remoteAs} multihop=${p.multihop ? 'yes' : 'no'}`);
      });
    }
  }

  return lines.join('\n').trim();
}
