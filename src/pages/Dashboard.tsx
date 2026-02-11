import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Lock } from 'lucide-react';
import {KPICard}  from '../components/dashboard/KPICard';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';
import { KPIData } from '../types';

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getKPIData();
        setKpiData(data);
      } catch (error) {
        console.error('Failed to fetch KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Real-time threat intelligence and security metrics</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Sessions"
          value={kpiData?.totalSessions || 0}
          icon={Activity}
          trend="Last 24 hours"
          iconColor="bg-blue-600"
        />
        <KPICard
          title="Active Threats"
          value={kpiData?.activeThreats || 0}
          icon={Shield}
          trend="Currently monitored"
          iconColor="bg-red-600"
        />
        <KPICard
          title="High Risk Alerts"
          value={kpiData?.highRiskAlerts || 0}
          icon={AlertTriangle}
          trend="Requires attention"
          iconColor="bg-orange-600"
        />
        <KPICard
          title="Blocked Attacks"
          value={kpiData?.blockedAttacks || 0}
          icon={Lock}
          trend="Successfully mitigated"
          iconColor="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Critical Alerts</span>
              <span className="text-sm font-semibold text-red-600">3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="text-sm font-semibold text-orange-600">5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <span className="text-sm font-semibold text-yellow-600">12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">SQL Injection Detected</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Brute Force Attempt Blocked</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Threat Successfully Mitigated</p>
                <p className="text-xs text-gray-500">32 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Port Scan Detected</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
