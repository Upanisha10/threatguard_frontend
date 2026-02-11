import { Session, Alert, KPIData } from '../types';
import { mockKPIData, mockSessions, mockAlerts } from './mockData';

class ApiService {
  async getKPIData(): Promise<KPIData> {
    await this.delay(300);
    return mockKPIData;
  }

  async getSessions(): Promise<Session[]> {
    await this.delay(500);
    return mockSessions;
  }

  async getAlerts(): Promise<Alert[]> {
    await this.delay(400);
    return mockAlerts;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    await this.delay(800);

    if (email && password) {
      return { token: 'mock-jwt-token-12345' };
    }

    throw new Error('Invalid credentials');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();
