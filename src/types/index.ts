export interface Session {
  id: string;
  attackerIp: string;
  country: string;
  sessionStart: string;
  duration: number;
  riskScore: number;
  status: 'active' | 'terminated' | 'monitoring';
  attackType: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  source: string;
  status: 'open' | 'investigating' | 'resolved';
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
