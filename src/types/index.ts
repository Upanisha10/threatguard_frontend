export interface Session {
  id: string;
  attackerIp: string;
  country: string;
  duration: number;
  status: "active" | "monitoring" | "terminated";
  sessionStart: string;
}


export interface Alert {
  id: string;              
  riskScore: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  latestEventTime: string;
}


export interface KPIData {
  totalSessions: number;
  activeThreats: number;
  highRiskAlerts: number;
  blockedAttacks: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst';
}
