import { Card } from '../components/ui/Card';
import { AttackTrendsChart } from '../components/analytics/AttackTrendsChart';
import { ThreatDistributionChart } from '../components/analytics/ThreatDistributionChart';
import { TrendingUp, PieChart } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Analytics</h2>
        <p className="text-gray-600 mt-1">Visualize attack patterns and threat intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-blue-900 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Attack Trends</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Daily attack volume and mitigation effectiveness
          </p>
          <AttackTrendsChart />
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-6">
            <PieChart className="w-5 h-5 text-blue-900 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Threat Distribution</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Breakdown of attack types detected
          </p>
          <ThreatDistributionChart />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Top Attack Source</h4>
          <p className="text-2xl font-bold text-gray-900">Russia</p>
          <p className="text-sm text-gray-500 mt-1">32% of total attacks</p>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Most Common Attack</h4>
          <p className="text-2xl font-bold text-gray-900">Brute Force</p>
          <p className="text-sm text-gray-500 mt-1">35% of all incidents</p>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Average Risk Score</h4>
          <p className="text-2xl font-bold text-gray-900">73.4</p>
          <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-md">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                SQL injection attempts increased by 24% this week
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Consider implementing additional WAF rules for database protection
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-md">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Brute force attacks targeting authentication endpoints
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Review rate limiting policies and implement account lockout mechanisms
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-md">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                95% threat mitigation rate maintained
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Current security posture is effective against known attack vectors
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
