import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { AttackTrendsChart } from "../components/analytics/AttackTrendsChart";
import { ThreatDistributionChart } from "../components/analytics/ThreatDistributionChart";
import { TrendingUp, PieChart, Activity, AlertTriangle } from "lucide-react";
import { apiService } from "../services/api";

export default function Analytics() {

  // KPI states
  const [topCountry, setTopCountry] = useState<string>("-");
  const [topAttackType, setTopAttackType] = useState<string>("-");
  const [avgRisk, setAvgRisk] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<number>(0);
  const [totalAttacks, setTotalAttacks] = useState<number>(0);
  const [criticalCount, setCriticalCount] = useState<number>(0);

  // 🔥 Chart states (THIS WAS MISSING)
  const [attackTrend, setAttackTrend] = useState<any[]>([]);
  const [attackTypes, setAttackTypes] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [
        countries,
        attackTypesData,
        avgRiskScore,
        activeSessionsCount,
        totalAttackCount,
        criticalAttackCount,
        trendData
      ] = await Promise.all([
        apiService.getCountryDistribution(),
        apiService.getAttackTypes(),
        apiService.getAvgRisk(),
        apiService.getActiveSessions(),
        apiService.getTotalAttacks(),
        apiService.getCriticalCount(),
        apiService.getAttackTrend(),   // 🔥 added
      ]);

      // Top country
      if (countries?.length > 0) {
        setTopCountry(countries[0].country);
      }

      // Attack types
      if (attackTypesData?.length > 0) {

        const top = attackTypesData.reduce((max, current) =>
          current.count > max.count ? current : max
        );

        setTopAttackType(top.attackType);
        setAttackTypes(attackTypesData);
      }


      // Trend data
      setAttackTrend(trendData); // 🔥 important

      // KPIs
      setAvgRisk(avgRiskScore);
      setActiveSessions(activeSessionsCount);
      setTotalAttacks(totalAttackCount);
      setCriticalCount(criticalAttackCount);

    } catch (error) {
      console.error("Analytics fetch failed", error);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Security Intelligence Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Real-time threat monitoring and attack intelligence insights
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card className="p-6 border-l-4 border-blue-900">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-gray-600">Active Sessions</h4>
            <Activity className="w-5 h-5 text-blue-900" />
          </div>
          <p className="text-3xl font-bold mt-2">{activeSessions}</p>
        </Card>

        <Card className="p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-gray-600">Critical Threats</h4>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold mt-2">{criticalCount}</p>
        </Card>

        <Card className="p-6 border-l-4 border-orange-500">
          <h4 className="text-sm text-gray-600">Total Attacks</h4>
          <p className="text-3xl font-bold mt-2">{totalAttacks}</p>
        </Card>

        <Card className="p-6 border-l-4 border-green-600">
          <h4 className="text-sm text-gray-600">Average Risk Score</h4>
          <p className="text-3xl font-bold mt-2">
            {avgRisk ? avgRisk.toFixed(1) : 0}
          </p>
        </Card>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-blue-900 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Attack Trends
            </h3>
          </div>
          <AttackTrendsChart data={attackTrend} />
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-6">
            <PieChart className="w-5 h-5 text-blue-900 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Attack Type Distribution
            </h3>
          </div>
          <ThreatDistributionChart data={attackTypes} />
        </Card>

      </div>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Threat Intelligence Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Top Attack Source</p>
            <p className="text-xl font-bold mt-2">{topCountry}</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Most Common Attack</p>
            <p className="text-xl font-bold mt-2">{topAttackType}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Security Posture</p>
            <p className="text-xl font-bold mt-2">
              {criticalCount > 5 ? "Elevated Risk" : "Stable"}
            </p>
          </div>

        </div>
      </Card>

    </div>
  );
}
