import { Session, Alert, KPIData } from '../types';
import { mockKPIData, mockSessions, mockAlerts } from './mockData';

function calculateDurationSeconds(start: string, end: string | null) {
  if (!start) return 0;

  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : Date.now();

  return Math.floor((endTime - startTime) / 1000);
}

function mapStatus(state: string) {
  if (!state) return "monitoring";

  switch (state.toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "CLOSED":
      return "terminated";
    default:
      return "monitoring";
  }
}


class ApiService {
  private BASE_URL = "http://localhost:8080";

  async getKPIData(): Promise<KPIData> {
    await this.delay(300);
    return mockKPIData;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token");

    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  async login(username: string, password: string): Promise<{ token: string; role: string }> {
    const response = await fetch(`${this.BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: username,
        password
      })
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    return response.json();
  }

  // 🔥 USER MANAGEMENT APIs

  async getUsers() {
    const response = await fetch(`${this.BASE_URL}/api/users/getUsers`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  }

  async registerUser(userData: any) {
  const response = await fetch(`${this.BASE_URL}/api/users/register`, {
    method: "POST",
    headers: this.getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
  }

  return response.json(); // 🔥 important
}



 async updateUser(id: number, userData: any) {
  const response = await fetch(`${this.BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: this.getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}


  async deleteUser(id: number) {
  const response = await fetch(`${this.BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: this.getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}

async resetPassword(token: string, newPassword: string) {
  const response = await fetch(`${this.BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      newPassword
    })
  });

  if (!response.ok) {
    throw new Error("Reset failed");
  }

  return response.json();
}

async forgotPassword(email: string) {
  const response = await fetch(
    `${this.BASE_URL}/api/auth/forgot-password?email=${email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send reset email");
  }

  return response.json();
}


async getSessions() {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${this.BASE_URL}/api/sessions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  const data = await response.json();

  return data.map((s: any) => ({
    id: s.sessionId,
    attackerIp: s.sourceIp,
    country: s.sourceCountry || "Unknown",
    duration: calculateDurationSeconds(s.startTime, s.endTime),
    status: mapStatus(s.state),
    sessionStart: s.startTime,
  }));
}

async getAlerts() {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${this.BASE_URL}/api/alerts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  const data = await response.json();

  return data.map((a: any) => ({
    id: a.sessionId,
    riskScore: a.riskScore,
    severity: a.severity.toLowerCase(), // backend sends CRITICAL
    latestEventTime: a.latestEventTime,
  }));
}

async getSessionConversation(sessionId: string) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${this.BASE_URL}/api/sessions/${sessionId}/conversation`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return response.json();
}

async getAuditLogs() {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${this.BASE_URL}/api/audit`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch audit logs");
  }

  return response.json();
}




  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();

