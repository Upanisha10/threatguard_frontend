
import { Alert } from '../../types';
import { AlertTriangle, Shield, Info } from 'lucide-react';

interface AlertItemProps {
  alert: Alert;
}

export function AlertItem({ alert }: AlertItemProps) {
  const getSeverityStyles = (severity: Alert['severity']) => {
    const styles = {
      critical: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
      },
      high: {
        bg: 'bg-orange-50 border-orange-200',
        text: 'text-orange-800',
        icon: 'text-orange-600',
      },
      medium: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
      },
      low: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
      },
    };
    return styles[severity];
  };

  const getStatusColor = (status: Alert['status']) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return colors[status];
  };

  const getIcon = (severity: Alert['severity']) => {
    if (severity === 'critical' || severity === 'high') {
      return AlertTriangle;
    }
    if (severity === 'medium') {
      return Shield;
    }
    return Info;
  };

  const styles = getSeverityStyles(alert.severity);
  const Icon = getIcon(alert.severity);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={`border rounded-lg p-4 ${styles.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-full bg-white`}>
            <Icon className={`w-5 h-5 ${styles.icon}`} />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className={`text-base font-semibold ${styles.text}`}>
                {alert.title}
              </h3>
              <span className={`ml-4 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                {alert.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-700">
              {alert.description}
            </p>

            <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
              <span className="font-medium">Source: {alert.source}</span>
              <span>•</span>
              <span>{formatDate(alert.timestamp)}</span>
              <span>•</span>
              <span className={`uppercase font-semibold ${styles.text}`}>
                {alert.severity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
