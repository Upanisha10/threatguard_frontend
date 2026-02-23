import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    date: string;
    count: number;
  }[];
}

export function AttackTrendsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
            type="monotone"
            dataKey="count"
            stroke="#1E3A8A"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

      </LineChart>
    </ResponsiveContainer>
  );
}
