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

  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  // Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 8;

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const clearFilters = () => {
  setSearch("");
  setActionFilter("");
  setStatusFilter("");
  setUserFilter("");
  setEntityFilter("");
  setFromDate("");
  setToDate("");
  setCurrentPage(1);
};

  const exportCSV = () => {
  const headers = [
    "Time",
    "Action",
    "Status",
    "Entity Type",
    "Entity ID",
    "User",
    "IP Address"
  ];

  const rows = filteredLogs.map((log) => [
    new Date(log.timestamp).toLocaleString(),
    log.action,
    log.status,
    log.entityType,
    log.entityId || "-",
    log.performedBy,
    log.ipAddress
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${value}"`).join(",")
      )
      .join("\n");

  // Add UTF-8 BOM so Excel reads properly
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // Format filename with date filters
  const from = fromDate ? fromDate : "start";
  const to = toDate ? toDate : "today";

  const fileName = `audit_logs_${from}_to_${to}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
    return logs.filter((log) => {
      const logDate = new Date(log.timestamp);

      const matchesSearch =
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
        log.entityId?.toLowerCase().includes(search.toLowerCase());

      const matchesAction =
        actionFilter === "" || log.action === actionFilter;

      const matchesStatus =
        statusFilter === "" || log.status === statusFilter;

      const matchesUser =
        userFilter === "" || log.performedBy === userFilter;

      const matchesEntity =
        entityFilter === "" || log.entityId === entityFilter;

      const matchesFrom =
        fromDate === "" || logDate >= new Date(fromDate);

      const matchesTo =
        toDate === "" ||
        logDate <= new Date(new Date(toDate).setHours(23, 59, 59, 999));

      return (
        matchesSearch &&
        matchesAction &&
        matchesStatus &&
        matchesUser &&
        matchesEntity &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [
    logs,
    search,
    actionFilter,
    statusFilter,
    userFilter,
    entityFilter,
    fromDate,
    toDate,
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + logsPerPage
  );

  const actions = [...new Set(logs.map((l) => l.action))];
  const users = [...new Set(logs.map((l) => l.performedBy))];
  const entities = [...new Set(logs.map((l) => l.entityId))];

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

      {/* Search + Filters */}
      <Card className="p-4 shadow-sm border">
        <div className="flex items-center bg-gray-50 border rounded-md px-3 py-2 mb-3">
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

        {/* Filters (UI unchanged style) */}
      <Card className="p-4 shadow-sm border">
  {/* Search */}
  <div className="flex items-center bg-gray-50 border rounded-md px-3 py-2 mb-3">
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

  {/* Row 1 : Date Range */}
  <div className="grid grid-cols-2 gap-3 mb-3">

  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">From Date</label>
    <input
      type="date"
      value={fromDate}
      onChange={(e) => {
        setFromDate(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-md px-3 py-2 text-sm w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">To Date</label>
    <input
      type="date"
      value={toDate}
      onChange={(e) => {
        setToDate(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-md px-3 py-2 text-sm w-full"
    />
  </div>

</div>

  {/* Row 2 : Filters + Buttons */}
  <div className="grid grid-cols-6 gap-3">

    <select
      value={actionFilter}
      onChange={(e) => {
        setActionFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-md px-3 py-2 text-sm bg-white w-full"
    >
      <option value="">All Actions</option>
      {actions.map((action) => (
        <option key={action}>{action}</option>
      ))}
    </select>

    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-md px-3 py-2 text-sm bg-white w-full"
    >
      <option value="">All Status</option>
      <option value="SUCCESS">SUCCESS</option>
      <option value="FAILED">FAILED</option>
    </select>

    <select
      value={userFilter}
      onChange={(e) => {
        setUserFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-md px-3 py-2 text-sm bg-white w-full"
    >
      <option value="">All Users</option>
      {users.map((user) => (
        <option key={user}>{user}</option>
      ))}
    </select>

    <select
      value={entityFilter}
      onChange={(e) => {
        setEntityFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="border rounded-md px-3 py-2 text-sm bg-white w-full"
    >
      <option value="">All Entities</option>
      {entities.map((entity) => (
        <option key={entity}>{entity}</option>
      ))}
    </select>

    <button
      onClick={clearFilters}
      className="border rounded-md px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
    >
      Clear Filters
    </button>

    <button
      onClick={exportCSV}
      className="border rounded-md px-4 py-2 text-sm bg-slate-900 text-white hover:bg-slate-800"
    >
      Export CSV
    </button>

  </div>
</Card>
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