import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Lock } from "lucide-react";
import { KPICard } from "../components/dashboard/KPICard";
import { Card } from "../components/ui/Card";
import { apiService } from "../services/api";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const data = await apiService.getDashboardOverview();

        setDashboard(data);

      } catch (error) {

        console.error("Failed to fetch dashboard:", error);

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

  const critical = dashboard?.threatStatus?.critical || 0;
  const high = dashboard?.threatStatus?.high || 0;
  const medium = dashboard?.threatStatus?.medium || 0;

  const totalThreats = critical + high + medium || 1;

  return (

    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">
          Real-time threat intelligence and security metrics
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <KPICard
          title="Total Sessions"
          value={dashboard?.totalSessions || 0}
          icon={Activity}
          trend="Last 24 hours"
          iconColor="bg-blue-600"
        />

        <KPICard
          title="Active Threats"
          value={dashboard?.activeThreats || 0}
          icon={Shield}
          trend="Currently monitored"
          iconColor="bg-red-600"
        />

        <KPICard
          title="High Risk Alerts"
          value={dashboard?.highRiskAlerts || 0}
          icon={AlertTriangle}
          trend="Requires attention"
          iconColor="bg-orange-600"
        />

        <KPICard
          title="Blocked Attacks"
          value={dashboard?.blockedAttacks || 0}
          icon={Lock}
          trend="Successfully mitigated"
          iconColor="bg-green-600"
        />

      </div>

      {/* SECOND ROW */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* THREAT STATUS */}

        <Card className="p-6">

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Threat Status
          </h3>

          <div className="space-y-4">

            {/* CRITICAL */}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Critical Alerts</span>
              <span className="text-sm font-semibold text-red-600">
                {critical}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(critical / totalThreats) * 100}%` }}
              />
            </div>

            {/* HIGH */}

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="text-sm font-semibold text-orange-600">
                {high}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${(high / totalThreats) * 100}%` }}
              />
            </div>

            {/* MEDIUM */}

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <span className="text-sm font-semibold text-yellow-600">
                {medium}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${(medium / totalThreats) * 100}%` }}
              />
            </div>

          </div>

        </Card>

        {/* RECENT ACTIVITY */}

        <Card className="p-6">

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>

          <div className="space-y-3">

            {dashboard?.recentActivity?.map((item: any, index: number) => (

              <div
                key={index}
                className="flex items-start space-x-3 pb-3 border-b border-gray-100"
              >

                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    item.severity === "critical"
                      ? "bg-red-600"
                      : item.severity === "high"
                      ? "bg-orange-600"
                      : "bg-yellow-600"
                  }`}
                />

                <div className="flex-1">

                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </Card>

      </div>

    </div>

  );

}