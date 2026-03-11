export interface Session {
  id: string;
  attackerIp: string;
  country: string;
  duration: number;
  status: "new" | "active" | "terminated" | "expired";
  sessionStart: string;
}


export interface Alert {
  id: string; 
  alertTitle: string;             
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
