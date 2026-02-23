import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#A5B4FC",
  "#C4B5FD",
  "#7DD3FC",
  "#FDBA74",
  "#86EFAC",
  "#FCA5A5",
];

interface Props {
  data: {
    attackType: string;
    count: number;
  }[];
}

export function ThreatDistributionChart({ data }: Props) {
  return (
    <div className="flex items-center">

      {/* Pie */}
      <div className="w-2/3 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="attackType"
              outerRadius={100}
              paddingAngle={0}     // ❌ no gaps
              label={false}
              labelLine={false}
              stroke="none"        // ❌ removes white borders
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-1/3 space-y-3 pl-6">
        {(data || []).map((entry, index) => (
          <div
            key={entry.attackType}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />
              <span className="text-sm text-gray-700">
                {entry.attackType}
              </span>
            </div>

            <span className="text-sm font-semibold text-gray-900">
              {entry.count}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
