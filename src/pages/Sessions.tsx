import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { SessionsTable } from "../components/sessions/SessionsTable";
import { apiService } from "../services/api";
import { Session } from "../types";

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 8;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await apiService.getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filtering
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.attackerIp
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        session.country
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const paginatedSessions = filteredSessions.slice(
    startIndex,
    startIndex + sessionsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading sessions...
      </div>
    );
  }

  // Stats
  const activeCount = sessions.filter((s) => s.status === "active").length;
  const closedCount = sessions.filter((s) => s.status === "monitoring").length;
  const timeoutCount = sessions.filter((s) => s.status === "terminated").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Attacker Sessions
          </h2>
          <p className="text-gray-500 mt-1">
            Monitor and analyze attacker activity
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {filteredSessions.length} total sessions
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-xl font-semibold text-green-600">
            {activeCount}
          </p>
        </Card>

        <Card className="p-4 border shadow-sm">
          <p className="text-sm text-gray-500">Closed</p>
          <p className="text-xl font-semibold text-blue-600">
            {closedCount}
          </p>
        </Card>

        <Card className="p-4 border shadow-sm">
          <p className="text-sm text-gray-500">Timeout</p>
          <p className="text-xl font-semibold text-red-600">
            {timeoutCount}
          </p>
        </Card>
      </div>

      {/* Search + Filter */}
      <Card className="p-6 border shadow-sm">
        <div className="flex items-center justify-between mb-6">

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by IP or country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="ml-4 flex items-center">
            <Filter className="w-4 h-4 text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="TIMEOUT">Timeout</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <SessionsTable sessions={paginatedSessions} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
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
                className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
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
