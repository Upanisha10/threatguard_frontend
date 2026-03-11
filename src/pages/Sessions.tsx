import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { SessionsTable } from "../components/sessions/SessionsTable";
import { apiService } from "../services/api";
import { Session } from "../types";
import { Client } from "@stomp/stompjs";

function calculateDurationSeconds(startTime: string, endTime: string) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.floor((end - start) / 1000);
}

function mapStatus(state: string) {
  if (!state) return "active";

  switch (state.toUpperCase()) {
    case "NEW":
    case "ACTIVE":
      return "active";

    case "EXPIRED":
      return "expired";

    case "TERMINATED":
      return "terminated";

    default:
      return "active";
  }
}

export default function Sessions() {

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 8;

  const handleTerminate = async (id: string) => {
    try {
      await apiService.terminateSession(id);
    } catch (err) {
      console.error("Terminate failed", err);
    }
  };

  // INITIAL REST FETCH
  useEffect(() => {

    const fetchSessions = async () => {

      try {

        const data = await apiService.getSessions();

        const normalized = data.map((s: any) => {

          const endTime =
            s.state === "EXPIRED" || s.state === "TERMINATED"
              ? s.endTime
              : new Date().toISOString();

          return {
            id: String(s.sessionId ?? s.id),
            attackerIp: s.sourceIp ?? "-",
            country: s.sourceCountry ?? "Unknown",

            duration: calculateDurationSeconds(
              s.startTime,
              endTime
            ),

            status: mapStatus(s.state),

            sessionStart: s.startTime
          };
        });

        setSessions(normalized);

      } catch (error) {

        console.error("Failed to fetch sessions:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchSessions();

  }, []);

  // WEBSOCKET LIVE UPDATES
  useEffect(() => {

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    });

    client.onConnect = () => {

      client.subscribe("/topic/sessions", (message) => {

        const raw = JSON.parse(message.body);

        const endTime =
          raw.state === "EXPIRED" || raw.state === "TERMINATED"
            ? raw.endTime
            : new Date().toISOString();

        const newSession: Session = {

          id: String(raw.id ?? raw.sessionId),

          attackerIp: raw.sourceIp ?? "-",

          country: raw.sourceCountry ?? "Unknown",

          duration: calculateDurationSeconds(
            raw.startTime,
            endTime
          ),

          status: mapStatus(raw.state),

          sessionStart: raw.startTime
        };

        setSessions((prev) => {

          const existing = prev.find(
            (s) => s.id === newSession.id
          );

          if (existing) {
            return prev.map((s) =>
              s.id === newSession.id ? newSession : s
            );
          }

          return [newSession, ...prev];

        });

      });

    };

    client.activate();

    return () => {
      client.deactivate();
    };

  }, []);

  // FILTERING
  const filteredSessions = useMemo(() => {

    return sessions.filter((session) => {

      const ip = session.attackerIp ?? "";
      const country = session.country ?? "";

      const matchesSearch =
        ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || session.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [sessions, searchTerm, statusFilter]);

  // PAGINATION
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

  // STATS
  const activeCount = sessions.filter((s) => s.status === "active").length;

  const expiredCount = sessions.filter((s) => s.status === "expired").length;

  const terminatedCount = sessions.filter((s) => s.status === "terminated").length;

  return (

    <div className="space-y-6">

      {/* HEADER */}

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

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-3 gap-4">

        <Card className="p-4 border shadow-sm">

          <p className="text-sm text-gray-500">Active</p>

          <p className="text-xl font-semibold text-green-600">
            {activeCount}
          </p>

        </Card>

        <Card className="p-4 border shadow-sm">

          <p className="text-sm text-gray-500">Expired</p>

          <p className="text-xl font-semibold text-yellow-600">
            {expiredCount}
          </p>

        </Card>

        <Card className="p-4 border shadow-sm">

          <p className="text-sm text-gray-500">Terminated</p>

          <p className="text-xl font-semibold text-red-600">
            {terminatedCount}
          </p>

        </Card>

      </div>

      {/* SEARCH + FILTER */}

      <Card className="p-6 border shadow-sm">

        <div className="flex items-center justify-between mb-6">

          {/* SEARCH */}

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            />

          </div>

          {/* FILTER */}

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
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>

            </select>

          </div>

        </div>

        {/* TABLE */}

        <SessionsTable
          sessions={paginatedSessions}
          onTerminate={handleTerminate}
        />

        {/* PAGINATION */}

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
                className="p-2 border rounded-md bg-white hover:bg-gray-100"
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
                className="p-2 border rounded-md bg-white hover:bg-gray-100"
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