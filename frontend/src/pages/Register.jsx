import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === key ? "rgba(0,210,200,0.60)" : "rgba(255,255,255,0.10)"}`,
    background: focused === key ? "rgba(0,210,200,0.06)" : "rgba(255,255,255,0.05)",
    fontSize: "15px",
    color: "#ffffff",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    boxShadow: focused === key ? "0 0 0 4px rgba(0,210,200,0.10)" : "none",
    fontFamily: "inherit",
    caretColor: "#00d2c8",
    boxSizing: "border-box",
  });

  const labelStyle = (key) => ({
    fontSize: "11px", fontWeight: "700",
    letterSpacing: "0.10em", textTransform: "uppercase",
    color: focused === key ? "#00d2c8" : "rgba(255,255,255,0.40)",
    transition: "color 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f2d 40%, #0a2028 70%, #071a1a 100%)",
      position: "relative",
      overflow: "hidden",
    }}>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.28) !important; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0d1f2d inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reg-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 36px rgba(0,210,200,0.45) !important;
        }
        .reg-btn:active { transform: translateY(0) !important; }
        .login-link { color: #00d2c8 !important; text-decoration: none; font-weight: 600; }
        .login-link:hover { text-decoration: underline !important; }
      `}</style>

      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: "-100px", right: "-80px",
        width: "380px", height: "380px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,210,200,0.09), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.04) inset",
        overflow: "hidden",
        animation: "fadeUp 0.5s ease both",
      }}>

        {/* Header */}
        <div style={{
          padding: "32px 36px 26px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-40px", left: "-40px",
            width: "150px", height: "150px", borderRadius: "50%",
            background: "rgba(14,165,233,0.10)", filter: "blur(36px)",
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            textDecoration: "none", marginBottom: "22px",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "9px",
              background: "linear-gradient(135deg, #00d2c8, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px", boxShadow: "0 0 12px rgba(0,210,200,0.35)",
            }}>⚙</div>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px" }}>
              MaintainPro
            </span>
          </Link>

          <h1 style={{
            fontSize: "26px", fontWeight: "900",
            color: "#ffffff", margin: "0 0 6px",
            letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            Create account
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.40)", margin: 0 }}>
            Get started with MaintainPro for free
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} style={{
          padding: "26px 36px 34px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}>

          {/* Error */}
          {error && (
            <div style={{
              padding: "11px 14px", borderRadius: "10px",
              background: "rgba(251,113,133,0.12)",
              border: "1px solid rgba(251,113,133,0.25)",
              color: "#fb7185", fontSize: "13px", fontWeight: "500",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={labelStyle("name")}>Full Name</label>
            <input
              type="text"
              placeholder="John Smith"
              value={form.name}
              onChange={set("name")}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle("name")}
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={labelStyle("email")}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle("email")}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={labelStyle("password")}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle("password")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="reg-btn"
            style={{
              marginTop: "4px",
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: loading
                ? "rgba(0,210,200,0.25)"
                : "linear-gradient(135deg, #00d2c8, #0ea5e9)",
              color: loading ? "rgba(255,255,255,0.50)" : "#001a1a",
              fontSize: "15px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              boxShadow: loading ? "none" : "0 4px 20px rgba(0,210,200,0.30)",
              transition: "transform 0.2s, box-shadow 0.2s",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "2px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontWeight: "500" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Login link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.40)", margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" className="login-link">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
