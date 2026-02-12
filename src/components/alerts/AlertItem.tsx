import { Alert } from '../../types';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";


interface AlertItemProps {
  alert: Alert;
  onViewDetails: () => void;
}


export function AlertItem({ alert, onViewDetails }: AlertItemProps) {

   const navigate = useNavigate();

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
          <div className="p-2 rounded-full bg-white">
            <Icon className={`w-5 h-5 ${styles.icon}`} />
          </div>

          <div className="flex-1">
            <h3 className={`text-base font-semibold ${styles.text}`}>
              Suspicious Session Detected
            </h3>

            <p className="mt-1 text-sm text-gray-700">
              Session ID: <span className="font-mono">{alert.id}</span>
            </p>

            <div className="mt-2 text-sm">
              Risk Score: 
              <span className={`ml-2 font-semibold ${styles.text}`}>
                {alert.riskScore}
              </span>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              {formatDate(alert.latestEventTime)}
              <span className="ml-3 uppercase font-semibold">
                {alert.severity}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="mt-3 text-sm text-blue-700 hover:underline"
        >
          View Conversation →
        </button>



      </div>
    </div>
  );
}
