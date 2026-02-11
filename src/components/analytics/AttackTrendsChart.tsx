import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockAttackTrends } from '../../services/mockData';

export function AttackTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mockAttackTrends}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="attacks"
          stroke="#ef4444"
          strokeWidth={2}
          name="Total Attacks"
          dot={{ fill: '#ef4444', r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="blocked"
          stroke="#10b981"
          strokeWidth={2}
          name="Blocked"
          dot={{ fill: '#10b981', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
