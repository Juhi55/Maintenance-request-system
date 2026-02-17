import { useEffect, useState } from "react";
import API from "../services/api";
import RequestList from "../components/RequestList";

const CARDS = [
  {
    key: "all",
    icon: "📋",
    label: "Total Requests",
    accent: "#3b82f6",
    soft: "rgba(59,130,246,0.10)",
    getValue: (requests) => requests.length,
  },
  {
    key: "pending",
    icon: "⏳",
    label: "Pending",
    accent: "#f59e0b",
    soft: "rgba(245,158,11,0.10)",
    getValue: (requests) =>
      requests.filter((r) => r.status === "Pending").length,
  },
  {
    key: "completed",
    icon: "✅",
    label: "Completed",
    accent: "#10b981",
    soft: "rgba(16,185,129,0.10)",
    getValue: (requests) =>
      requests.filter((r) => r.status === "Completed").length,
  },
];

function StatCard({ icon, label, value, accent, soft, isActive, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px 26px 24px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: active
          ? "0 20px 48px -8px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)"
          : "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        transform: active ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease",
        outline: isActive ? `2px solid ${accent}` : "2px solid transparent",
        outlineOffset: "-2px",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: accent,
        borderRadius: "20px 20px 0 0",
        opacity: active ? 1 : 0,
        transition: "opacity 0.25s",
      }} />

      {/* Glow blob */}
      <div style={{
        position: "absolute",
        top: "-40px", right: "-40px",
        width: "130px", height: "130px",
        borderRadius: "50%",
        background: accent,
        opacity: active ? 0.08 : 0.03,
        filter: "blur(32px)",
        transition: "opacity 0.3s",
        pointerEvents: "none",
      }} />

      {/* Icon */}
      <div style={{
        width: "42px", height: "42px",
        borderRadius: "11px",
        background: soft,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px",
        marginBottom: "16px",
      }}>
        {icon}
      </div>

      {/* Number */}
      <span style={{
        fontSize: "48px",
        fontWeight: "700",
        color: "#0b1628",
        lineHeight: 1,
        letterSpacing: "-2px",
        marginBottom: "6px",
      }}>
        {value}
      </span>

      {/* Label */}
      <span style={{
        fontSize: "13px",
        fontWeight: "500",
        color: "#64748b",
        letterSpacing: "0.02em",
        marginBottom: "20px",
      }}>
        {label}
      </span>

      {/* CTA hint */}
      <span style={{
        fontSize: "12px",
        fontWeight: "600",
        color: accent,
        letterSpacing: "0.04em",
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : "translateX(-6px)",
        transition: "opacity 0.2s, transform 0.2s",
      }}>
        {isActive ? "Hide ↑" : "View →"}
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: "#f1f5f9",
      borderRadius: "20px",
      minHeight: "190px",
    }} />
  );
}

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/maintenance");
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCardClick = (key) => {
    setFilter((prev) => (prev === key ? null : key));
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (r) =>
            r.status ===
            (filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "")
        );

  const completed = requests.filter((r) => r.status === "Completed").length;
  const completionRate =
    requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;

  const circumference = 2 * Math.PI * 26;

  return (
    <div style={{
      maxWidth: "1080px",
      margin: "0 auto",
      padding: "56px 24px 80px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      color: "#0b1628",
      position: "relative",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
        marginBottom: "48px",
      }}>
        <div>
          <p style={{
            fontSize: "11px",
            fontWeight: "600",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#3b82f6",
            margin: "0 0 10px",
          }}>
            Maintenance Portal
          </p>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: "800",
            color: "#0b1628",
            lineHeight: 1.08,
            letterSpacing: "-1.5px",
            margin: "0 0 10px",
          }}>
            Welcome back
            <span style={{ color: "#3b82f6" }}>.</span>
          </h1>
          <p style={{
            fontSize: "15px",
            color: "#64748b",
            margin: 0,
            lineHeight: "1.6",
          }}>
            Here's a quick overview of your maintenance requests.
          </p>
        </div>

        {/* Completion ring */}
        {!loading && requests.length > 0 && (
          <div style={{ position: "relative", width: "90px", height: "90px", flexShrink: 0 }}>
            <svg width="90" height="90" viewBox="0 0 64 64"
              style={{ transform: "rotate(-90deg)", display: "block" }}>
              <circle cx="32" cy="32" r="26"
                fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5" />
              <circle cx="32" cy="32" r="26"
                fill="none" stroke="#10b981" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * completionRate) / 100}
                style={{ transition: "stroke-dashoffset 1.2s ease 0.3s" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#0b1628", lineHeight: 1 }}>
                {completionRate}%
              </span>
              <span style={{ fontSize: "9px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                done
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Stats grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
        marginBottom: "32px",
      }}>
        {loading
          ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
          : CARDS.map((card, i) => (
              <StatCard
                key={card.key}
                index={i}
                icon={card.icon}
                label={card.label}
                accent={card.accent}
                soft={card.soft}
                value={card.getValue(requests)}
                isActive={filter === card.key}
                onClick={() => handleCardClick(card.key)}
              />
            ))}
      </div>

      {/* ── Request list panel ── */}
      {filter && (
        <div style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 26px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}>
            <span style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#0b1628",
              letterSpacing: "-0.3px",
            }}>
              {filter === "all"
                ? "All Requests"
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </span>
            <span style={{
              background: "rgba(59,130,246,0.10)",
              color: "#3b82f6",
              fontSize: "13px",
              fontWeight: "600",
              padding: "3px 12px",
              borderRadius: "99px",
            }}>
              {filteredRequests.length}
            </span>
          </div>
          <RequestList requests={filteredRequests} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
