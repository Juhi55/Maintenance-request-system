import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

const STATUS_STYLE = {
  "Pending":     { bg: "rgba(251,113,133,0.12)", color: "#fb7185", border: "rgba(251,113,133,0.25)" },
  "In Progress": { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", border: "rgba(251,191,36,0.25)"  },
  "Completed":   { bg: "rgba(0,210,200,0.12)",   color: "#00d2c8", border: "rgba(0,210,200,0.25)"   },
};

const PRIORITY_STYLE = {
  "Low":    { bg: "rgba(14,165,233,0.12)",  color: "#38bdf8" },
  "Medium": { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
  "High":   { bg: "rgba(251,113,133,0.12)", color: "#fb7185" },
};

function StatCard({ value, label, accent, soft, border, isActive, onClick }) {
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
        borderRadius: "18px",
        padding: "24px 22px 20px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: active ? `0 10px 36px ${soft}, 0 2px 8px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.05)",
        transform: active ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(.22,.68,0,1.2)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: accent, borderRadius: "18px 18px 0 0",
        opacity: active ? 1 : 0, transition: "opacity 0.25s",
      }} />
      <div style={{
        position: "absolute", top: "-28px", right: "-28px",
        width: "100px", height: "100px", borderRadius: "50%",
        background: accent, opacity: active ? 0.08 : 0.03,
        filter: "blur(24px)", transition: "opacity 0.3s", pointerEvents: "none",
      }} />
      <div style={{ fontSize: "44px", fontWeight: "900", color: active ? accent : "#0f172a", lineHeight: 1, letterSpacing: "-2px", marginBottom: "6px", transition: "color 0.25s" }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", fontWeight: "500", color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: "11px", fontWeight: "700", color: accent, marginTop: "14px", opacity: active ? 1 : 0, transition: "opacity 0.2s" }}>
        {isActive ? "Hide ↑" : "View →"}
      </div>
    </div>
  );
}

function RequestCard({ req, onStatusChange, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updating, setUpdating] = useState(false);
  const s = STATUS_STYLE[req.status] || STATUS_STYLE["Pending"];
  const p = PRIORITY_STYLE[req.priority] || PRIORITY_STYLE["Low"];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onStatusChange(req._id, newStatus);
    setUpdating(false);
  };

  return (
    <div style={{
      background: "#ffffff",
      border: "1.5px solid #e2e8f0",
      borderRadius: "16px",
      padding: "20px 22px",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.2px" }}>
            {req.title}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Priority badge */}
            <span style={{
              fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "99px",
              background: p.bg, color: p.color,
            }}>
              {req.priority}
            </span>
            {/* Status badge */}
            <span style={{
              fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "99px",
              background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            }}>
              {req.status}
            </span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Description</div>
          <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>{req.description}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Location</div>
          <div style={{ fontSize: "13px", color: "#334155" }}>📍 {req.location}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px", gridColumn: "1 / -1" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Submitted By</div>
          <div style={{ fontSize: "13px", color: "#334155" }}>
            👤 <strong>{req.createdBy?.name}</strong> · {req.createdBy?.email}
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        {/* Status changer */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Status:</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {STATUS_OPTIONS.map((opt) => {
              const st = STATUS_STYLE[opt];
              const isSelected = req.status === opt;
              return (
                <button
                  key={opt}
                  disabled={updating}
                  onClick={() => handleStatusChange(opt)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: "8px",
                    border: `1.5px solid ${isSelected ? st.color : "#e2e8f0"}`,
                    background: isSelected ? st.bg : "transparent",
                    color: isSelected ? st.color : "#94a3b8",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: updating ? "not-allowed" : "pointer",
                    transition: "all 0.18s",
                    fontFamily: "inherit",
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delete */}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1.5px solid rgba(251,113,133,0.30)",
              background: "rgba(251,113,133,0.06)",
              color: "#fb7185",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.18s",
              display: "flex", alignItems: "center", gap: "5px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(251,113,133,0.14)"; e.currentTarget.style.borderColor = "#fb7185"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(251,113,133,0.06)"; e.currentTarget.style.borderColor = "rgba(251,113,133,0.30)"; }}
          >
            🗑 Delete
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Sure?</span>
            <button
              onClick={() => onDelete(req._id)}
              style={{
                padding: "5px 12px", borderRadius: "8px", border: "none",
                background: "#ef4444", color: "#fff",
                fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
              }}
            >Confirm</button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                padding: "5px 12px", borderRadius: "8px",
                border: "1.5px solid #e2e8f0", background: "transparent",
                color: "#64748b", fontSize: "12px", fontWeight: "600",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Reports() {
  const [report, setReport] = useState(null);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Guard: redirect non-admins immediately
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const fetchReport = async () => {
    try {
      const res = await API.get("/reports");
      setReport(res.data);
    } catch (err) {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/maintenance/${id}`, { status: newStatus });
      fetchReport();
    } catch (err) {
      console.error("Error updating status");
    }
  };

  const deleteRequest = async (id) => {
    try {
      await API.delete(`/maintenance/${id}`);
      fetchReport();
    } catch (err) {
      console.error("Error deleting request");
    }
  };

  const filteredRequests = !report ? [] :
    filter === "all"       ? report.requests :
    filter === "pending"   ? report.requests.filter((r) => r.status === "Pending") :
    filter === "completed" ? report.requests.filter((r) => r.status === "Completed") :
    [];

  const circumference = 2 * Math.PI * 26;
  const completionRate = report ? Math.round((report.completed / report.total) * 100) || 0 : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #eef2f7 0%, #e8f0f5 50%, #eaf4f4 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    }}>

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        select.status-select {
          padding: 6px 10px; border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc; font-size: 13px;
          color: #334155; cursor: pointer; font-family: inherit;
          outline: none;
        }
        select.status-select:focus { border-color: #0891b2; }
      `}</style>

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "24px", marginBottom: "44px",
        }}>
          <div>
            <p style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#0891b2", margin: "0 0 10px",
            }}>Admin Panel</p>
            <h1 style={{
              fontSize: "clamp(28px,4vw,44px)", fontWeight: "900", color: "#0f172a",
              lineHeight: 1.08, letterSpacing: "-1.5px", margin: "0 0 10px",
            }}>
              Reports<span style={{ color: "#0891b2" }}>.</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: "1.65" }}>
              Overview of all maintenance requests across the organization.
            </p>
          </div>

          {/* Completion ring */}
          {report && report.total > 0 && (
            <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: 0 }}>
              <svg width="88" height="88" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)", display: "block" }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#0d9488" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * completionRate) / 100}
                  style={{ transition: "stroke-dashoffset 1.2s ease 0.3s" }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "17px", fontWeight: "900", color: "#0d9488", lineHeight: 1 }}>{completionRate}%</span>
                <span style={{ fontSize: "9px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>done</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Stat cards ── */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "18px", marginBottom: "32px" }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{
                background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
                borderRadius: "18px", minHeight: "130px",
              }} />
            ))}
          </div>
        ) : report && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "18px", marginBottom: "32px" }}>
            <StatCard value={report.total}     label="Total Requests" accent="#0891b2" soft="rgba(8,145,178,0.12)"  border="rgba(8,145,178,0.20)"  isActive={filter === "all"}       onClick={() => setFilter((p) => p === "all"       ? null : "all")}       />
            <StatCard value={report.pending}   label="Pending"        accent="#e05a78" soft="rgba(224,90,120,0.10)" border="rgba(224,90,120,0.20)" isActive={filter === "pending"}   onClick={() => setFilter((p) => p === "pending"   ? null : "pending")}   />
            <StatCard value={report.completed} label="Completed"      accent="#0d9488" soft="rgba(13,148,136,0.10)" border="rgba(13,148,136,0.20)" isActive={filter === "completed"} onClick={() => setFilter((p) => p === "completed" ? null : "completed")} />
          </div>
        )}

        {/* ── Request list ── */}
        {filter && (
          <div style={{ animation: "panelIn 0.35s cubic-bezier(.22,.68,0,1.2)" }}>
            {/* Panel header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "16px",
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.3px" }}>
                {filter === "all" ? "All Requests" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </h2>
              <span style={{
                background: "rgba(8,145,178,0.10)", border: "1px solid rgba(8,145,178,0.22)",
                color: "#0891b2", fontSize: "12px", fontWeight: "700",
                padding: "3px 12px", borderRadius: "99px",
              }}>
                {filteredRequests.length}
              </span>
            </div>

            {filteredRequests.length === 0 ? (
              <div style={{
                background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px",
                padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "15px",
              }}>
                No requests found.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    req={req}
                    onStatusChange={updateStatus}
                    onDelete={deleteRequest}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
