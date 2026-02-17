import { useEffect, useState } from "react";
import API from "../services/api";
import RequestList from "../components/RequestList";

const CARDS = [
  {
    key: "all",
    icon: "📋",
    label: "Total Requests",
    accent: "#0891b2",
    soft: "rgba(8,145,178,0.08)",
    border: "rgba(8,145,178,0.20)",
    glow: "rgba(8,145,178,0.12)",
    getValue: (r) => r.length,
  },
  {
    key: "pending",
    icon: "⏳",
    label: "Pending",
    accent: "#e05a78",
    soft: "rgba(224,90,120,0.08)",
    border: "rgba(224,90,120,0.20)",
    glow: "rgba(224,90,120,0.10)",
    getValue: (r) => r.filter((x) => x.status === "Pending").length,
  },
  {
    key: "completed",
    icon: "✅",
    label: "Completed",
    accent: "#0d9488",
    soft: "rgba(13,148,136,0.08)",
    border: "rgba(13,148,136,0.20)",
    glow: "rgba(13,148,136,0.10)",
    getValue: (r) => r.filter((x) => x.status === "Completed").length,
  },
];

function StatCard({ icon, label, value, accent, soft, border, glow, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active ? "#ffffff" : "#f8fafc",
        border: `1.5px solid ${active ? accent : "#e2e8f0"}`,
        borderRadius: "20px",
        padding: "28px 26px 24px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: active
          ? `0 12px 40px ${glow}, 0 2px 8px rgba(0,0,0,0.06)`
          : "0 1px 4px rgba(0,0,0,0.05)",
        transform: active ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(.22,.68,0,1.2)",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        borderRadius: "20px 20px 0 0",
        opacity: active ? 1 : 0,
        transition: "opacity 0.25s",
      }} />

      {/* Soft glow blob */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "110px", height: "110px", borderRadius: "50%",
        background: accent,
        opacity: active ? 0.08 : 0.03,
        filter: "blur(28px)",
        transition: "opacity 0.3s",
        pointerEvents: "none",
      }} />

      {/* Icon box */}
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: soft,
        border: `1px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", marginBottom: "18px",
      }}>
        {icon}
      </div>

      {/* Number */}
      <span style={{
        fontSize: "52px", fontWeight: "900",
        color: active ? accent : "#0f172a",
        lineHeight: 1, letterSpacing: "-3px",
        marginBottom: "6px",
        transition: "color 0.25s",
      }}>
        {value}
      </span>

      {/* Label */}
      <span style={{
        fontSize: "13px", fontWeight: "500",
        color: "#64748b",
        letterSpacing: "0.02em", marginBottom: "18px",
      }}>
        {label}
      </span>

      {/* CTA */}
      <span style={{
        fontSize: "12px", fontWeight: "700",
        color: accent, letterSpacing: "0.04em",
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : "translateX(-8px)",
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
      border: "1.5px solid #e2e8f0",
      borderRadius: "20px",
      minHeight: "200px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }} />
    </div>
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

  useEffect(() => { fetchRequests(); }, []);

  const handleCardClick = (key) => setFilter((prev) => (prev === key ? null : key));

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (r) => r.status === (filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "")
        );

  const completed = requests.filter((r) => r.status === "Completed").length;
  const completionRate = requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;
  const circumference = 2 * Math.PI * 26;

  return (
    <div style={{
      minHeight: "100vh",
      /* Light slate — clearly lighter than the dark sidebar */
      background: "linear-gradient(160deg, #eef2f7 0%, #e8f0f5 50%, #eaf4f4 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      color: "#0f172a",
    }}>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "24px",
          marginBottom: "44px",
        }}>
          <div>
            <p style={{
              fontSize: "11px", fontWeight: "700",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#0891b2", margin: "0 0 10px",
            }}>
              Maintenance Portal
            </p>
            <h1 style={{
              fontSize: "clamp(30px, 4vw, 46px)",
              fontWeight: "900", color: "#0f172a",
              lineHeight: 1.08, letterSpacing: "-1.5px",
              margin: "0 0 10px",
            }}>
              Welcome back
              <span style={{ color: "#0891b2" }}>.</span>
            </h1>
            <p style={{
              fontSize: "15px", color: "#64748b",
              margin: 0, lineHeight: "1.65", maxWidth: "360px",
            }}>
              Here's a quick overview of your maintenance requests.
            </p>
          </div>

          {/* Completion ring */}
          {!loading && requests.length > 0 && (
            <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: 0 }}>
              <svg width="88" height="88" viewBox="0 0 64 64"
                style={{ transform: "rotate(-90deg)", display: "block" }}>
                <circle cx="32" cy="32" r="26"
                  fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="32" cy="32" r="26"
                  fill="none" stroke="#0d9488" strokeWidth="5"
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
                <span style={{ fontSize: "17px", fontWeight: "900", color: "#0d9488", lineHeight: 1 }}>
                  {completionRate}%
                </span>
                <span style={{ fontSize: "9px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>
                  done
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Stat cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "32px",
        }}>
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : CARDS.map((card) => (
                <StatCard
                  key={card.key}
                  icon={card.icon}
                  label={card.label}
                  accent={card.accent}
                  soft={card.soft}
                  border={card.border}
                  glow={card.glow}
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
            border: "1.5px solid #e2e8f0",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            animation: "panelIn 0.35s cubic-bezier(.22,.68,0,1.2)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 26px",
              borderBottom: "1px solid #f1f5f9",
              background: "#fafcfe",
            }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                {filter === "all" ? "All Requests" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
              <span style={{
                background: "rgba(8,145,178,0.10)",
                border: "1px solid rgba(8,145,178,0.22)",
                color: "#0891b2",
                fontSize: "12px", fontWeight: "700",
                padding: "3px 12px", borderRadius: "99px",
              }}>
                {filteredRequests.length}
              </span>
            </div>
            <RequestList requests={filteredRequests} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
