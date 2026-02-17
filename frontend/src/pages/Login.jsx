import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
        @keyframes blink {
          0%,100% { box-shadow: 0 0 0 3px rgba(0,210,200,0.20); }
          50%      { box-shadow: 0 0 0 7px rgba(0,210,200,0.05); }
        }
        .login-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 36px rgba(0,210,200,0.45) !important;
        }
        .login-btn:active { transform: translateY(0) !important; }
        .register-link { color: #00d2c8 !important; text-decoration: none; font-weight: 600; }
        .register-link:hover { text-decoration: underline !important; }
      `}</style>

      {/* Background glow orbs */}
      <div style={{
        position: "absolute", top: "-100px", left: "-100px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,210,200,0.10), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", right: "-80px",
        width: "350px", height: "350px", borderRadius: "50%",
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
          padding: "36px 36px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative blob */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "150px", height: "150px", borderRadius: "50%",
            background: "rgba(0,210,200,0.12)", filter: "blur(36px)",
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            textDecoration: "none", marginBottom: "24px",
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
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.40)", margin: 0 }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{
          padding: "28px 36px 36px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}>

          {/* Error banner */}
          {error && (
            <div style={{
              padding: "11px 14px",
              borderRadius: "10px",
              background: "rgba(251,113,133,0.12)",
              border: "1px solid rgba(251,113,133,0.25)",
              color: "#fb7185",
              fontSize: "13px", fontWeight: "500",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={{
              fontSize: "11px", fontWeight: "700",
              letterSpacing: "0.10em", textTransform: "uppercase",
              color: focused === "email" ? "#00d2c8" : "rgba(255,255,255,0.40)",
              transition: "color 0.2s",
            }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle("email")}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={{
              fontSize: "11px", fontWeight: "700",
              letterSpacing: "0.10em", textTransform: "uppercase",
              color: focused === "password" ? "#00d2c8" : "rgba(255,255,255,0.40)",
              transition: "color 0.2s",
            }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            className="login-btn"
            style={{
              marginTop: "6px",
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: loading
                ? "rgba(0,210,200,0.30)"
                : "linear-gradient(135deg, #00d2c8, #0ea5e9)",
              color: loading ? "rgba(255,255,255,0.60)" : "#001a1a",
              fontSize: "15px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              boxShadow: loading ? "none" : "0 4px 20px rgba(0,210,200,0.30)",
              transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
              fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", margin: "4px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontWeight: "500" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Register link */}
          <p style={{
            textAlign: "center", fontSize: "14px",
            color: "rgba(255,255,255,0.40)", margin: 0,
          }}>
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
