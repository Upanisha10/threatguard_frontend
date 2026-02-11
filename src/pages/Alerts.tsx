import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { AlertItem } from '../components/alerts/AlertItem';
import { apiService } from '../services/api';
import { Alert } from '../types';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await apiService.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter((alert) => alert.severity === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Alerts</h2>
        <p className="text-gray-600 mt-1">Monitor and respond to security incidents</p>
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by severity:</span>
        <div className="flex space-x-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === severity
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No alerts found matching the selected filter.
        </div>
      )}
    </div>
  );
}
