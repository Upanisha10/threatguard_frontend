import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { AttackTrendsChart } from "../components/analytics/AttackTrendsChart";
import { ThreatDistributionChart } from "../components/analytics/ThreatDistributionChart";
import { TrendingUp, PieChart, Activity, AlertTriangle } from "lucide-react";
import { apiService } from "../services/api";
import { AttackMap } from "../components/analytics/AttackMap";

export default function Analytics() {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [topCountry, setTopCountry] = useState("-");
  const [topAttackType, setTopAttackType] = useState("-");
  const [avgRisk, setAvgRisk] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);

  const [attackTrend, setAttackTrend] = useState<any[]>([]);
  const [attackTypes, setAttackTypes] = useState<any[]>([]);
  const [attackMapData, setAttackMapData] = useState<any[]>([]);

  const [noData, setNoData] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [fromDate, toDate]);

  const fetchAnalytics = async () => {
    try {

      const [
        countries,
        attackTypesData,
        avgRiskScore,
        activeSessionsCount,
        totalAttackCount,
        criticalAttackCount,
        trendData,
        mapData
      ] = await Promise.all([
        apiService.getCountryDistribution(),
        apiService.getAttackTypes(),
        apiService.getAvgRisk(),
        apiService.getActiveSessions(),
        apiService.getTotalAttacks(),
        apiService.getCriticalCount(),
        apiService.getAttackTrend(),
        apiService.getAttackMap()
      ]);

      // ---------- SORT TREND DATA ----------
      let sortedTrend = [...trendData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // ---------- APPLY DATE FILTER ----------
      let filteredTrend = sortedTrend;

      if (fromDate) {
        filteredTrend = filteredTrend.filter(
          (item) => new Date(item.date) >= new Date(fromDate)
        );
      }

      if (toDate) {
        filteredTrend = filteredTrend.filter(
          (item) => new Date(item.date) <= new Date(toDate)
        );
      }

      setAttackTrend(filteredTrend);
      setAttackMapData(mapData);

      // ---------- NO DATA CHECK ----------
      if (filteredTrend.length === 0) {
        setNoData(true);

        setTotalAttacks(0);
        setCriticalCount(0);
        setAvgRisk(0);
        setTopCountry("-");
        setTopAttackType("-");
        setAttackTypes([]);

        return;
      } else {
        setNoData(false);
      }

      // ---------- KPIs RECALCULATED ----------
      const calculatedTotal = filteredTrend.reduce(
        (sum, item) => sum + item.count,
        0
      );

      setTotalAttacks(calculatedTotal);

      setCriticalCount(criticalAttackCount);
      setAvgRisk(avgRiskScore);
      setActiveSessions(activeSessionsCount);

      // ---------- COUNTRY ----------
      if (countries?.length > 0) {
        setTopCountry(countries[0].country);
      }

      // ---------- ATTACK TYPES ----------
      if (attackTypesData?.length > 0) {

        const top = attackTypesData.reduce((max, current) =>
          current.count > max.count ? current : max
        );

        setTopAttackType(top.attackType);
        setAttackTypes(attackTypesData);
      }

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

      {/* Date Filters */}
      {/* Date Filters */}
      <div className="grid grid-cols-3 gap-4 items-end">

        {/* From Date */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full"
          />
        </div>

        {/* Clear Button */}
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
          }}
          className="bg-gray-100 text-gray-700 border rounded-md px-4 py-2 text-sm hover:bg-gray-200 w-full"
        >
          Clear Dates
        </button>

      </div>

      {/* NO DATA MESSAGE */}
      {noData && (
        <div className="text-sm text-red-600 font-medium">
          No data available for the selected date range.
        </div>
      )}

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

      <Card className="p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Global Attack Map
      </h3>

      <AttackMap data={attackMapData} />
    </Card>

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