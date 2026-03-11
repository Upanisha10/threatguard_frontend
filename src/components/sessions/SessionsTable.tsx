import { Session } from '../../types';
import { apiService } from '../../services/api';

interface SessionsTableProps {
  sessions: Session[];
  onTerminate: (sessionId: string) => void;
}

export function SessionsTable({ sessions, onTerminate }: SessionsTableProps) {

  const getStatusColor = (status: Session['status']) => {

    const colors = {
      new: 'bg-blue-100 text-blue-800',
      active: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-gray-100 text-gray-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">

        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Session ID
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attacker IP
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Country
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Started
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>

          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">

          {sessions.map((session) => (

            <tr key={session.id} className="hover:bg-gray-50">

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {session.id}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                {session.attackerIp}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {session.country}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDuration(session.duration)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    session.status
                  )}`}
                >
                  {formatStatus(session.status)}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(session.sessionStart)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm">

                {session.status !== "terminated" && session.status !== "expired" && (

                  <button
                    onClick={() => onTerminate(session.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Terminate
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
}