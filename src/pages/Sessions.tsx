import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { SessionsTable } from '../components/sessions/SessionsTable';
import { apiService } from '../services/api';
import { Session } from '../types';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await apiService.getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) =>
    session.attackerIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.attackType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attacker Sessions</h2>
        <p className="text-gray-600 mt-1">Monitor and analyze active attack sessions</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by IP, country, or attack type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button className="ml-4 flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        <SessionsTable sessions={filteredSessions} />
      </Card>

      <div className="text-sm text-gray-600">
        Showing {filteredSessions.length} of {sessions.length} sessions
      </div>
    </div>
  );
}
