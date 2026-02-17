import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const PRIORITIES = [
  { value: "Low",    color: "#0d9488", soft: "rgba(13,148,136,0.10)",  border: "rgba(13,148,136,0.35)", icon: "○" },
  { value: "Medium", color: "#d97706", soft: "rgba(217,119,6,0.10)",   border: "rgba(217,119,6,0.35)",  icon: "◑" },
  { value: "High",   color: "#e05a78", soft: "rgba(224,90,120,0.10)",  border: "rgba(224,90,120,0.35)", icon: "●" },
];

const FIELDS = [
  { key: "title",       label: "Request Title", placeholder: "e.g. Broken hallway light",     type: "input",    icon: "✦" },
  { key: "description", label: "Description",   placeholder: "Describe the issue in detail…",  type: "textarea", icon: "≡" },
  { key: "location",    label: "Location",      placeholder: "e.g. Building A, Room 204",      type: "input",    icon: "◎" },
];

function FieldWrapper({ label, icon, focused, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{
        fontSize: "11px", fontWeight: "700",
        letterSpacing: "0.10em", textTransform: "uppercase",
        color: focused ? "#0891b2" : "#94a3b8",
        display: "flex", alignItems: "center", gap: "6px",
        transition: "color 0.2s",
      }}>
        <span style={{ fontSize: "13px" }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function CreateRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", location: "", priority: "Low" });
  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputStyle = (key) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === key ? "#0891b2" : "#e2e8f0"}`,
    background: focused === key ? "#f0f9ff" : "#f8fafc",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    boxShadow: focused === key ? "0 0 0 4px rgba(8,145,178,0.10)" : "none",
    fontFamily: "inherit",
    resize: "none",
    boxSizing: "border-box",
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
    <>
      <style>{`
        input::placeholder, textarea::placeholder { color: #94a3b8 !important; }
        .submit-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(8,145,178,0.30) !important; }
        .submit-btn:active { transform: translateY(0) !important; }
        .back-btn:hover { background: #e2e8f0 !important; }
      `}</style>

      {/* ── Outer wrapper: equal padding all sides ── */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #eef2f7 0%, #e8f0f5 50%, #eaf4f4 100%)",
        padding: "48px 32px",          /* equal left & right padding */
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",      /* horizontally centered */
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
      }}>

        {/* ── Card: max width so it doesn't stretch full screen ── */}
        <div style={{
          width: "100%",
          maxWidth: "560px",           /* limits width, creates equal side space */
          background: "#ffffff",
          borderRadius: "24px",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>

          {/* ── Card header ── */}
          <div style={{
            background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f2d 100%)",
            padding: "28px 32px 24px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "140px", height: "140px", borderRadius: "50%",
              background: "rgba(0,210,200,0.12)", filter: "blur(32px)", pointerEvents: "none",
            }} />

            <button
              className="back-btn"
              onClick={() => navigate("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px", color: "rgba(255,255,255,0.65)",
                fontSize: "12px", fontWeight: "500", padding: "5px 12px",
                cursor: "pointer", marginBottom: "18px",
                display: "inline-flex", alignItems: "center", gap: "5px",
                fontFamily: "inherit", transition: "background 0.2s",
              }}
            >← Back</button>

            <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#00d2c8", margin: "0 0 6px" }}>
              Maintenance Portal
            </p>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
              New Request
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
              Fill in the details to submit a maintenance request.
            </p>
          </div>

          {/* ── Form body ── */}
          <form onSubmit={handleSubmit} style={{
            padding: "28px 32px 32px",    /* equal left & right padding inside card */
            display: "flex", flexDirection: "column", gap: "20px",
          }}>

            {FIELDS.map(({ key, label, placeholder, type, icon }) => (
              <FieldWrapper key={key} label={label} icon={icon} focused={focused === key}>
                {type === "textarea" ? (
                  <textarea
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={set(key)}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    required rows={4}
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

            {/* Priority */}
            <FieldWrapper label="Priority Level" icon="◈" focused={false}>
              <div style={{ display: "flex", gap: "10px" }}>
                {PRIORITIES.map((p) => {
                  const active = form.priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                      style={{
                        flex: 1, padding: "10px 8px", borderRadius: "12px",
                        border: `1.5px solid ${active ? p.color : "#e2e8f0"}`,
                        background: active ? p.soft : "#f8fafc",
                        color: active ? p.color : "#94a3b8",
                        fontSize: "13px", fontWeight: "700",
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.2s",
                        boxShadow: active ? `0 0 0 3px ${p.soft}` : "none",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      }}
                    >
                      <span>{p.icon}</span>{p.value}
                    </button>
                  );
                })}
              </div>
            </FieldWrapper>

            {/* Divider */}
            <div style={{ height: "1px", background: "#f1f5f9" }} />

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || submitted}
              className="submit-btn"
              style={{
                width: "100%", padding: "14px",
                borderRadius: "12px", border: "none",
                background: submitted
                  ? "#0d9488"
                  : submitting
                  ? "#bae6fd"
                  : "linear-gradient(135deg, #0891b2, #0ea5e9)",
                color: submitted || submitting ? "#fff" : "#fff",
                fontSize: "15px", fontWeight: "800",
                cursor: submitting || submitted ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                boxShadow: submitted || submitting ? "none" : "0 4px 16px rgba(8,145,178,0.28)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.25s",
                fontFamily: "inherit",
              }}
            >
              {submitted ? "✓  Request Submitted!" : submitting ? "Submitting…" : "Submit Request →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", margin: 0 }}>
              Priority:{" "}
              <span style={{ color: selectedPriority.color, fontWeight: "700" }}>
                {selectedPriority.icon} {form.priority}
              </span>
              {" "}· Your request will be reviewed shortly.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateRequest;
