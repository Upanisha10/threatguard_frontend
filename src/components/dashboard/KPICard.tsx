import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  iconColor: string;
}

export function KPICard({ title, value, icon: Icon, trend, iconColor }: KPICardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Card>
  );
}
