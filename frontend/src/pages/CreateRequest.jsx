import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const PRIORITIES = [
  { value: "Low",    color: "#10b981", soft: "rgba(16,185,129,0.10)",  icon: "○" },
  { value: "Medium", color: "#f59e0b", soft: "rgba(245,158,11,0.10)",  icon: "◑" },
  { value: "High",   color: "#ef4444", soft: "rgba(239,68,68,0.10)",   icon: "●" },
];

const FIELDS = [
  { key: "title",       label: "Request Title",  placeholder: "e.g. Broken hallway light", type: "input",    icon: "✦" },
  { key: "description", label: "Description",    placeholder: "Describe the issue in detail…", type: "textarea", icon: "≡" },
  { key: "location",    label: "Location",       placeholder: "e.g. Building A, Room 204",  type: "input",    icon: "◎" },
];

function FieldWrapper({ label, icon, focused, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: focused ? "#6591d9" : "#64748b",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "color 0.2s",
      }}>
        <span style={{
          fontSize: "14px",
          color: focused ? "#3b82f6" : "#94a3b8",
          transition: "color 0.2s",
        }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function CreateRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", description: "", location: "", priority: "Low",
  });
  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputStyle = (key) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === key ? "#3b82f6" : "rgba(0,0,0,0.10)"}`,
    background: focused === key ? "#fafcff" : "#f8fafc",
    fontSize: "15px",
    color: "#7893c1",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    boxShadow: focused === key
      ? "0 0 0 4px rgba(69, 134, 239, 0.1)"
      : "none",
    fontFamily: "inherit",
    resize: "none",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/maintenance", form);
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      alert("Error creating request");
      setSubmitting(false);
    }
  };

  const selectedPriority = PRIORITIES.find((p) => p.value === form.priority);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      background: "#f0f4fb",
      // Subtle dot-grid
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(85, 149, 251, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 85% 80%, rgba(16,185,129,0.07) 0%, transparent 50%),
        radial-gradient(rgba(148,163,184,0.35) 1px, transparent 1px)
      `,
      backgroundSize: "auto, auto, 24px 24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>

        {/* ── Header banner ── */}
        <div style={{
          background: "linear-gradient(135deg,  #0d1f2d 50%,rgba(255, 255, 255, 0.07))",
          padding: "32px 36px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "rgba(35, 15, 42, 0.15)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", left: "30%",
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(183, 179, 184, 0.15)", pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                color: "rgba(255,255,255,0.70)",
                fontSize: "12px",
                fontWeight: "500",
                padding: "5px 12px",
                cursor: "pointer",
                marginBottom: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
            >
              ← Back
            </button>

            <p style={{
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#60a5fa",
              margin: "0 0 8px",
            }}>
              Maintenance Portal
            </p>
            <h1 style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}>
              New Request
            </h1>
            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              margin: "6px 0 0",
            }}>
              Fill in the details below to submit a maintenance request.
            </p>
          </div>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} style={{ padding: "32px 36px 36px", display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* Text fields */}
          {FIELDS.map(({ key, label, placeholder, type, icon }) => (
            <FieldWrapper key={key} label={label} icon={icon} focused={focused === key}>
              {type === "textarea" ? (
                <textarea
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  required
                  rows={4}
                  style={inputStyle(key)}
                />
              ) : (
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  required
                  style={inputStyle(key)}
                />
              )}
            </FieldWrapper>
          ))}

          {/* Priority selector */}
          <FieldWrapper label="Priority Level" icon="◈" focused={focused === "priority"}>
            <div style={{ display: "flex", gap: "10px" }}>
              {PRIORITIES.map((p) => {
                const active = form.priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                    style={{
                      flex: 1,
                      padding: "10px 8px",
                      borderRadius: "12px",
                      border: `1.5px solid ${active ? p.color : "rgba(0,0,0,0.09)"}`,
                      background: active ? p.soft : "#f8fafc",
                      color: active ? p.color : "#64748b",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                      boxShadow: active ? `0 0 0 4px ${p.soft}` : "none",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{p.icon}</span>
                    {p.value}
                  </button>
                );
              })}
            </div>
          </FieldWrapper>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "4px 0" }} />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || submitted}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              border: "none",
              background: submitted
                ? "#10b981"
                : submitting
                ? "#93c5fd"
                : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: submitting || submitted ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.25s",
              boxShadow: submitted || submitting
                ? "none"
                : "0 4px 16px rgba(59,130,246,0.35)",
              transform: submitting ? "scale(0.98)" : "scale(1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "inherit",
            }}
          >
            {submitted ? (
              <> ✓ &nbsp;Request Submitted!</>
            ) : submitting ? (
              <>Submitting…</>
            ) : (
              <>Submit Request →</>
            )}
          </button>

          {/* Priority hint */}
          <p style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#94a3b8",
            margin: 0,
          }}>
            Priority set to{" "}
            <span style={{ color: selectedPriority.color, fontWeight: "600" }}>
              {selectedPriority.icon} {form.priority}
            </span>
            {" "}· Your request will be reviewed shortly.
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;
