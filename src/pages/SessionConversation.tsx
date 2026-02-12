import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

export default function SessionConversation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await apiService.getSessionConversation(sessionId!);

        if (Array.isArray(data)) {
          setEvents(data);
          if (data.length > 0) setSession(data[0].session);
        } else {
          setSession(data.session);
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch conversation", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [sessionId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading conversation...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No session data found.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* PREMIUM HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold break-all">
              Session ID: {session.sessionId}
            </h2>
            <div className="text-sm text-blue-200 mt-1">
              {session.sourceIp} • {session.sourceCountry}
            </div>
          </div>

          <button
            onClick={() => navigate("/alerts")}
            className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-md text-sm transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="bg-white border-b px-6 py-4 text-sm text-gray-600 flex gap-10 shadow-sm">
        <div>
          <span className="font-medium text-gray-800">Status:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              session.state === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {session.state}
          </span>
        </div>

        <div>
          <span className="font-medium text-gray-800">Started:</span>{" "}
          {new Date(session.startTime).toLocaleString()}
        </div>

        {session.endTime && (
          <div>
            <span className="font-medium text-gray-800">Ended:</span>{" "}
            {new Date(session.endTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* CONVERSATION AREA */}
      <div className="flex-1 overflow-y-auto px-10 py-10 relative">

        {/* Timeline vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-200" />

        <div className="space-y-12 relative z-10">

          {events.map((event) => (
            <div key={event.eventId} className="relative">

              {/* ATTACKER MESSAGE */}
              {event.rawPayload && (
                <div className="flex justify-start">
                  <div className="relative bg-white border shadow-sm px-5 py-4 rounded-2xl max-w-xl">

                    {/* Severity Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl" />

                    <div className="text-xs text-red-500 font-semibold mb-2">
                      Attacker
                    </div>

                    <div className="text-sm text-gray-800 break-words">
                      {event.rawPayload}
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* HONEYPOT RESPONSE */}
              {event.responsePayload && (
                <div className="flex justify-end mt-4">
                  <div className="relative bg-blue-900 text-white px-5 py-4 rounded-2xl shadow-lg max-w-xl">

                    <div className="text-xs text-blue-200 font-semibold mb-2">
                      Honeypot Response
                    </div>

                    <div className="text-sm break-words">
                      {event.responsePayload}
                    </div>

                    <div className="text-xs text-blue-200 mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* End Marker */}
          {(session.state === "CLOSED" ||
            session.state === "TIMEOUT") && (
            <div className="text-center text-gray-400 text-sm mt-10">
              Session ended at{" "}
              {session.endTime &&
                new Date(session.endTime).toLocaleString()}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
