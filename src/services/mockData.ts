import { Session, Alert, KPIData } from '../types';

export const mockKPIData: KPIData = {
  totalSessions: 1247,
  activeThreats: 23,
  highRiskAlerts: 8,
  blockedAttacks: 342,
};

export const mockSessions: Session[] = [
  {
    id: 'S001',
    attackerIp: '192.168.45.12',
    country: 'Russia',
    sessionStart: '2024-01-04T10:23:00Z',
    duration: 145,
    riskScore: 87,
    status: 'active',
    attackType: 'SQL Injection',
  },
  {
    id: 'S002',
    attackerIp: '10.45.23.91',
    country: 'China',
    sessionStart: '2024-01-04T09:15:00Z',
    duration: 320,
    riskScore: 92,
    status: 'active',
    attackType: 'Brute Force',
  },
  {
    id: 'S003',
    attackerIp: '172.16.8.44',
    country: 'United States',
    sessionStart: '2024-01-04T08:42:00Z',
    duration: 67,
    riskScore: 45,
    status: 'monitoring',
    attackType: 'Port Scanning',
  },
  {
    id: 'S004',
    attackerIp: '203.45.67.89',
    country: 'North Korea',
    sessionStart: '2024-01-04T07:30:00Z',
    duration: 512,
    riskScore: 95,
    status: 'terminated',
    attackType: 'DDoS Attempt',
  },
  {
    id: 'S005',
    attackerIp: '89.234.12.56',
    country: 'Ukraine',
    sessionStart: '2024-01-04T06:18:00Z',
    duration: 89,
    riskScore: 63,
    status: 'monitoring',
    attackType: 'XSS Attack',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'A001',
    title: 'Multiple Failed Login Attempts Detected',
    description: 'Over 50 failed login attempts from IP 192.168.45.12 in the last 5 minutes.',
    severity: 'critical',
    timestamp: '2024-01-04T10:25:00Z',
    source: 'Authentication System',
    status: 'open',
  },
  {
    id: 'A002',
    title: 'SQL Injection Pattern Detected',
    description: 'Malicious SQL patterns found in user input from session S001.',
    severity: 'high',
    timestamp: '2024-01-04T10:23:30Z',
    source: 'Web Application Firewall',
    status: 'investigating',
  },
  {
    id: 'A003',
    title: 'Unusual Data Exfiltration Activity',
    description: 'Large data transfer detected from internal database to external IP.',
    severity: 'critical',
    timestamp: '2024-01-04T09:45:00Z',
    source: 'Network Monitor',
    status: 'investigating',
  },
  {
    id: 'A004',
    title: 'Port Scan Detected',
    description: 'Sequential port scanning detected from 172.16.8.44.',
    severity: 'medium',
    timestamp: '2024-01-04T08:50:00Z',
    source: 'IDS',
    status: 'resolved',
  },
  {
    id: 'A005',
    title: 'Suspicious File Upload',
    description: 'File with executable content uploaded to web server.',
    severity: 'high',
    timestamp: '2024-01-04T08:12:00Z',
    source: 'File Integrity Monitor',
    status: 'resolved',
  },
  {
    id: 'A006',
    title: 'Malware Signature Match',
    description: 'Known malware signature detected in network traffic.',
    severity: 'critical',
    timestamp: '2024-01-04T07:33:00Z',
    source: 'Antivirus Gateway',
    status: 'resolved',
  },
];

export const mockAttackTrends = [
  { date: '2024-01-01', attacks: 45, blocked: 42 },
  { date: '2024-01-02', attacks: 67, blocked: 63 },
  { date: '2024-01-03', attacks: 52, blocked: 48 },
  { date: '2024-01-04', attacks: 89, blocked: 85 },
];

export const mockThreatDistribution = [
  { name: 'SQL Injection', value: 28 },
  { name: 'Brute Force', value: 35 },
  { name: 'XSS', value: 18 },
  { name: 'DDoS', value: 12 },
  { name: 'Malware', value: 7 },
];
