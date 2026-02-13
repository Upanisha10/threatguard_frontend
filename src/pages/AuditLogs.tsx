import { useEffect, useState, useMemo } from "react";
import { apiService } from "../services/api";
import { Card } from "../components/ui/Card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
  id: number;
  action: string;
  status: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  performedByRole: string;
  ipAddress: string;
  endpoint: string;
  timestamp: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 8;

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const data = await apiService.getAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
        log.entityId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + logsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading audit logs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Audit Logs
          </h2>
          <p className="text-gray-500 mt-1">
            Monitor administrative and security events
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {filteredLogs.length} total records
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 shadow-sm border">
        <div className="flex items-center bg-gray-50 border rounded-md px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by action, user or entity ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Entity</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">IP</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-800">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        log.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    <span className="font-medium">
                      {log.entityType}
                    </span>{" "}
                    <span className="text-gray-500">
                      ({log.entityId || "-"})
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {log.performedBy}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedLogs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No audit logs found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
