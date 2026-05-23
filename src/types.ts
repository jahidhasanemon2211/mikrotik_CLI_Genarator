export type ConfigTab = 
  | 'interfaces' 
  | 'bridge'
  | 'ppp' 
  | 'ip' 
  | 'queues' 
  | 'routing'
  | 'tools'
  | null;

export interface AppState {
  // Interfaces & Bridge
  bridges: Array<{ id: string; name: string; ports: string }>;
  vlans: Array<{ id: string; name: string; vlanId: string; interface: string }>;
  
  // IP Addressing
  ipAddresses: Array<{ id: string; address: string; interface: string }>;
  dns: { primary: string; secondary: string; allowRemoteRequests: boolean };
  ipPools: Array<{ id: string; name: string; ranges: string }>;
  poolSettings: { masterNetwork: string; poolCidr: string };

  // Firewall & NAT
  srcNat: Array<{ id: string; srcAddress: string; srcAddressList: string; outInterface: string; action: string; toAddresses: string; disabled: boolean }>;
  dstNat: Array<{ id: string; protocol: string; dstPort: string; inInterface: string; action: string; toAddresses: string; toPorts: string }>;

  // Bandwidth Management
  queueTypes: Array<{ id: string; name: string; kind: string; pcqRate: string; pcqClassifier: string; pcqTotalLimit: string }>;
  queues: Array<{ id: string; name: string; target: string; dst: string; maxLimit: string; queueTypeUpload: string; queueTypeDownload: string; disabled: boolean }>;

  // PPPoE
  pppoeProfiles: Array<{ id: string; name: string; localAddress: string; remoteAddress: string; dnsServer: string; dnsServer2?: string; rateLimit: string; onlyOne: string }>;
  pppoeSecrets: Array<{ id: string; name: string; password: string; profile: string }>;
  pppoeServers: Array<{ id: string; serviceName: string; interface: string; keepalive: string; defaultProfile: string; oneSessionPerHost: boolean; authentication: string; disabled: boolean }>;

  // Tunnels & Routing
  eoipTunnels: Array<{ id: string; name: string; remoteAddress: string; tunnelId: string }>;
  bgp: {
    routerOsVersion: 'v6' | 'v7';
    templates: Array<{ id: string; name: string; as: string; routerId: string; disabled: boolean }>;
    peers: Array<{ id: string; name: string; type: 'iBGP' | 'eBGP'; template: string; as: string; peerAddress: string; remoteAs: string; multihop: boolean; routerId: string; inputFilter: string; outputFilterChain: string; outputNetwork: string; routingTable: string; disabled: boolean }>;
  };
}
