(globalThis as any).global = globalThis;

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Client } from "@stomp/stompjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SessionConversation() {

  const { sessionId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState<any>(null);

  const handleExportReport = async () => {
  try {

    const report = await apiService.getIncidentReport(session.sessionId);

    const pdf = new jsPDF("p", "mm", "a4");

    const margin: number = 20;
    const pageWidth: number = 210;
    const pageHeight: number = 297;
    const usableWidth: number = pageWidth - margin * 2;

    let y: number = 20;

    const lineHeight: number = 6;

    const addPageIfNeeded = (extraHeight: number = 0) => {
      if (y + extraHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    const writeSectionTitle = (title: string) => {
      addPageIfNeeded(10);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text(title, margin, y);
      y += 8;
    };

    const writeParagraph = (text: string, font: string = "helvetica") => {

      pdf.setFont(font, "normal");
      pdf.setFontSize(11);

      const lines = pdf.splitTextToSize(text, usableWidth);

      lines.forEach((line: string) => {
        addPageIfNeeded(lineHeight);
        pdf.text(line, margin, y);
        y += lineHeight;
      });

      y += 4;
    };

    const writeList = (items: string[]) => {

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      items.forEach((item: string) => {

        const lines = pdf.splitTextToSize("• " + item, usableWidth);

        lines.forEach((line: string) => {
          addPageIfNeeded(lineHeight);
          pdf.text(line, margin, y);
          y += lineHeight;
        });

        y += 2;

      });

      y += 4;
    };

    // TITLE
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(
      "ThreatGuard Security Incident Report",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 10;

    pdf.setDrawColor(200);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 12;

    // SESSION INFO
    writeSectionTitle("Session Information");

    writeParagraph(`Session ID: ${report.sessionId}`);
    writeParagraph(`Attacker IP: ${report.attackerIp}`);
    writeParagraph(`Attack Type: ${report.attackType}`);
    writeParagraph(`Severity: ${report.severity}`);

    // PAYLOAD
    writeSectionTitle("Attack Payload");
    writeParagraph(report.payload, "courier");

    // RESPONSE
    writeSectionTitle("Honeypot Response");
    writeParagraph(report.honeypotResponse, "courier");

    // EXPLANATION
    writeSectionTitle("Attack Explanation");
    writeParagraph(report.attackExplanation);

    // INTENT
    writeSectionTitle("Attacker Intent");
    writeParagraph(report.attackerIntent);

    // RECOMMENDATIONS
    writeSectionTitle("Security Recommendations");
    writeList(report.recommendations);

    pdf.save(`ThreatGuard-Incident-${report.sessionId}.pdf`);

  } catch (error) {
    console.error("Failed to generate report:", error);
  }
};

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

  useEffect(() => {

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    });

    client.onConnect = () => {

      client.subscribe(`/topic/session/${sessionId}`, (message) => {

        const event = JSON.parse(message.body);

        setEvents((prev) => {

          const existing = prev.find(
            (e) => e.eventId === event.eventId
          );

          if (existing) {
            return prev.map((e) =>
              e.eventId === event.eventId ? event : e
            );
          }

          return [...prev, event].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() -
              new Date(b.timestamp).getTime()
          );

        });

      });

    };

    client.activate();

    return () => {
      client.deactivate();
    };

  }, [sessionId]);

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

  const durationMinutes = Math.floor(
    (new Date(session.endTime || Date.now()).getTime() -
      new Date(session.startTime).getTime()) /
      60000
  );

  const getStatusColor = () => {

    if (session.state === "ACTIVE")
      return "bg-green-100 text-green-700";

    if (session.state === "EXPIRED")
      return "bg-yellow-100 text-yellow-700";

    return "bg-gray-200 text-gray-700";
  };

  return (

    <div className="h-full flex flex-col bg-gray-50">

      {/* HEADER */}
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

          <div className="flex gap-3">

            <button
              onClick={handleExportReport}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm text-white"
            >
              Export Report
            </button>

            {session.state === "ACTIVE" && (
              <button
                onClick={async () => {
                  await apiService.terminateSession(session.sessionId);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Terminate
              </button>
            )}

            <button
              onClick={() => navigate("/alerts")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-md text-sm transition"
            >
              ← Back
            </button>

          </div>

        </div>

      </div>

      {/* STATUS BAR */}
      <div className="bg-white border-b px-6 py-4 text-sm text-gray-600 flex gap-10 shadow-sm">

        <div>
          <span className="font-medium text-gray-800">Status:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}
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

        <div>
          <span className="font-medium text-gray-800">Duration:</span>{" "}
          {durationMinutes} min
        </div>

      </div>

      {/* CONVERSATION */}
      <div className="flex-1 overflow-y-auto px-10 py-10 relative">

        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-200" />

        <div className="space-y-12 relative z-10">

          {events.map((event) => (

            <div key={event.eventId} className="relative">

              {event.rawPayload && (

                <div className="flex justify-start">

                  <div
                    className={`relative border shadow-sm px-5 py-4 rounded-2xl max-w-xl ${
                      event.riskScore > 80
                        ? "bg-red-50 border-red-300"
                        : "bg-white"
                    }`}
                  >

                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl" />

                    <div className="text-xs text-red-500 font-semibold mb-2">
                      Attacker
                    </div>

                    {event.attackType && (
                      <div className="text-xs text-purple-600 mb-1">
                        {event.attackType.replace("_", " ")}
                      </div>
                    )}

                    <div className="text-sm text-gray-800 break-words">
                      {event.rawPayload}
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>

                  </div>

                </div>

              )}

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

          <div ref={bottomRef} />

        </div>

      </div>

    </div>

  );

}