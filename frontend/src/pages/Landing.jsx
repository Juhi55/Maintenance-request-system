import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function useCounter(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,210,200,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,210,200,${0.10 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

const ACTIVITY = [
  { icon: "🔧", text: "Broken AC unit — Floor 3",      time: "just now",   status: "Pending" },
  { icon: "💡", text: "Hallway light replacement",      time: "2 min ago",  status: "In Progress" },
  { icon: "🚪", text: "Door lock malfunction — B12",    time: "5 min ago",  status: "Completed" },
  { icon: "🪟", text: "Window seal repair — Rm 204",    time: "9 min ago",  status: "Pending" },
  { icon: "🔌", text: "Power outlet fault — Lab A",     time: "14 min ago", status: "Completed" },
];
const STATUS_COLOR = {
  "Pending":     { bg: "rgba(251,113,133,0.18)", color: "#fb7185" },
  "In Progress": { bg: "rgba(251,191,36,0.18)",  color: "#fbbf24" },
  "Completed":   { bg: "rgba(0,210,200,0.18)",   color: "#00d2c8" },
};

function ActivityFeed() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % ACTIVITY.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      background: "rgba(0,0,0,0.25)",
      border: "1px solid rgba(0,210,200,0.12)",
      borderRadius: "14px",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#00d2c8",
          boxShadow: "0 0 0 3px rgba(0,210,200,0.22)",
          flexShrink: 0,
          animation: "blink 2s infinite",
        }} />
        <span style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Live Activity
        </span>
      </div>
      {ACTIVITY.map((item, i) => {
        const s = STATUS_COLOR[item.status];
        return (
          <div key={i} style={{
            padding: "11px 18px",
            display: "flex", alignItems: "center", gap: "10px",
            borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            background: active === i ? "rgba(0,210,200,0.06)" : "transparent",
            transition: "background 0.5s",
          }}>
            <span style={{ fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.text}
            </span>
            <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "99px", background: s.bg, color: s.color, whiteSpace: "nowrap", flexShrink: 0 }}>
              {item.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(0,210,200,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(0,210,200,0.30)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "18px",
        padding: "28px 24px",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        animation: `fadeUp 0.6s ease ${delay}s both`,
        cursor: "default",
      }}
    >
      <div style={{
        width: "46px", height: "46px", borderRadius: "12px",
        background: accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "21px", marginBottom: "16px",
      }}>{icon}</div>
      <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: "1.65" }}>{desc}</div>
    </div>
  );
}

function Landing() {
  const [counted, setCounted] = useState(false);
  const statsRef = useRef(null);
  const requests = useCounter(12847, 2200, counted);
  const orgs     = useCounter(340,   1800, counted);
  const resolved = useCounter(98,    1600, counted);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCounted(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      /* Deep charcoal → midnight teal — rich, dark, professional */
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f2d 40%, #0a2028 70%, #071a1a 100%)",
      color: "#fff",
      overflowX: "hidden",
    }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blink {
          0%,100% { box-shadow:0 0 0 3px rgba(0,210,200,0.22); }
          50%      { box-shadow:0 0 0 7px rgba(0,210,200,0.06); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-14px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .btn-main:hover  { transform:translateY(-2px) !important; box-shadow:0 10px 36px rgba(0,210,200,0.40) !important; }
        .btn-ghost:hover { background:rgba(255,255,255,0.10) !important; border-color:rgba(255,255,255,0.30) !important; }
        .nav-login:hover { color:#00d2c8 !important; }
      `}</style>

      {/* ── Sticky Nav ── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 52px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        background: "rgba(7,15,28,0.70)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "linear-gradient(135deg, #00d2c8, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "17px", boxShadow: "0 0 16px rgba(0,210,200,0.35)",
          }}>⚙</div>
          <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.4px", color: "#fff" }}>
            MaintainPro
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link to="/login" className="nav-login" style={{
            color: "rgba(255,255,255,0.55)", fontSize: "14px", fontWeight: "500",
            textDecoration: "none", padding: "8px 18px", borderRadius: "8px",
            transition: "color 0.2s",
          }}>Login</Link>
          <Link to="/register" className="btn-main" style={{
            background: "linear-gradient(135deg, #00d2c8, #0ea5e9)",
            color: "#001a1a", fontSize: "14px", fontWeight: "800",
            textDecoration: "none", padding: "9px 22px", borderRadius: "10px",
            boxShadow: "0 4px 18px rgba(0,210,200,0.30)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}>Get Started →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: "1120px", margin: "0 auto",
        padding: "100px 52px 80px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "64px", alignItems: "center",
        position: "relative",
      }}>
        <ParticleField />

        {/* Left */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Pill badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(0,210,200,0.10)",
            border: "1px solid rgba(0,210,200,0.25)",
            borderRadius: "99px", padding: "6px 14px",
            fontSize: "11px", fontWeight: "700", color: "#00d2c8",
            letterSpacing: "0.10em", textTransform: "uppercase",
            marginBottom: "30px",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00d2c8", animation: "blink 2s infinite", flexShrink: 0 }} />
            Maintenance Management Platform
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 5vw, 58px)",
            fontWeight: "900",
            lineHeight: 1.06,
            letterSpacing: "-2.5px",
            margin: "0 0 24px",
            animation: "fadeUp 0.5s ease 0.2s both",
          }}>
            Fix faster.<br />
            <span style={{
              background: "linear-gradient(90deg, #00d2c8, #0ea5e9, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Track smarter.</span>
          </h1>

          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.50)",
            lineHeight: "1.75", maxWidth: "400px",
            margin: "0 0 38px",
            animation: "fadeUp 0.5s ease 0.3s both",
          }}>
            Submit, assign, and resolve maintenance requests in real time.
            Built for facilities that can't afford downtime.
          </p>

          <div style={{
            display: "flex", gap: "12px", flexWrap: "wrap",
            animation: "fadeUp 0.5s ease 0.4s both",
          }}>
            <Link to="/login" className="btn-main" style={{
              background: "linear-gradient(135deg, #00d2c8, #0ea5e9)",
              color: "#001a1a", fontSize: "16px", fontWeight: "800",
              textDecoration: "none", padding: "14px 30px", borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,210,200,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>Start Free →</Link>
            <Link to="/register" className="btn-ghost" style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.18)",
              color: "#fff", fontSize: "16px", fontWeight: "600",
              textDecoration: "none", padding: "14px 30px", borderRadius: "12px",
              transition: "background 0.2s, border-color 0.2s",
            }}>Create Account</Link>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "20px",
            marginTop: "30px",
            animation: "fadeUp 0.5s ease 0.5s both",
          }}>
            {["✓ Free forever plan", "✓ No credit card", "✓ Ready in 5 min"].map((t) => (
              <span key={t} style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", fontWeight: "500" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right — live preview */}
        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease 0.35s both" }}>
          <div style={{ animation: "float 5s ease-in-out infinite" }}>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(0,210,200,0.14)",
              borderRadius: "22px",
              padding: "22px",
              backdropFilter: "blur(24px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>Request Overview</span>
                <span style={{
                  fontSize: "11px", fontWeight: "700", color: "#00d2c8",
                  background: "rgba(0,210,200,0.12)", padding: "3px 10px", borderRadius: "99px",
                }}>● Live</span>
              </div>
              {/* Mini stat strip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Total",   val: "48", color: "#0ea5e9" },
                  { label: "Pending", val: "12", color: "#fb7185" },
                  { label: "Done",    val: "36", color: "#00d2c8" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px", padding: "14px 10px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.40)", marginTop: "5px", fontWeight: "500" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <ActivityFeed />
            </div>
          </div>

          {/* Floating badge */}
          <div style={{
            position: "absolute", bottom: "-18px", left: "-20px",
            background: "linear-gradient(135deg, #1e293b, #0f2030)",
            border: "1px solid rgba(0,210,200,0.20)",
            borderRadius: "12px", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: "10px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.40)",
            animation: "float 4s ease-in-out 1s infinite",
          }}>
            <span style={{ fontSize: "22px" }}>⚡</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>Avg. Response</div>
              <div style={{ fontSize: "11px", color: "#00d2c8", fontWeight: "600" }}>Under 2 hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div ref={statsRef} style={{
        background: "rgba(0,0,0,0.30)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        margin: "0",
      }}>
        <div style={{
          maxWidth: "1120px", margin: "0 auto", padding: "44px 52px",
          display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px",
        }}>
          {[
            { val: requests.toLocaleString(), suffix: "+", label: "Requests Resolved" },
            { val: orgs,                      suffix: "+", label: "Organizations" },
            { val: resolved,                  suffix: "%", label: "Resolution Rate" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(34px,4vw,52px)", fontWeight: "900",
                letterSpacing: "-2px", lineHeight: 1,
                background: "linear-gradient(90deg, #00d2c8, #38bdf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{s.val}{s.suffix}</div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.40)", marginTop: "8px", fontWeight: "500" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "88px 52px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#00d2c8", marginBottom: "12px" }}>
            Why MaintainPro
          </p>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: 1.1, margin: 0 }}>
            Everything your team needs,{" "}
            <span style={{
              background: "linear-gradient(90deg, #00d2c8, #0ea5e9)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>nothing it doesn't.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))", gap: "18px" }}>
          <FeatureCard delay={0}   icon="⚡" title="Instant Submissions"  accent="rgba(0,210,200,0.15)"   desc="Submit a request in under 30 seconds. No forms, no fuss — just describe and go." />
          <FeatureCard delay={0.1} icon="📡" title="Real-Time Tracking"   accent="rgba(14,165,233,0.15)"  desc="Watch requests move from Pending to Completed with live status updates." />
          <FeatureCard delay={0.2} icon="🔔" title="Smart Priorities"     accent="rgba(251,113,133,0.15)" desc="Tag as Low, Medium, or High — so critical issues never get buried in the queue." />
          <FeatureCard delay={0.3} icon="📊" title="Dashboard Overview"   accent="rgba(56,189,248,0.15)"  desc="See every request at a glance with a clean, filterable dashboard built for speed." />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ maxWidth: "1120px", margin: "0 auto 88px", padding: "0 52px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(0,210,200,0.12), rgba(14,165,233,0.08))",
          border: "1px solid rgba(0,210,200,0.20)",
          borderRadius: "24px",
          padding: "60px 52px",
          textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Corner glows */}
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(0,210,200,0.12)", filter:"blur(50px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"-40px", left:"-40px", width:"180px", height:"180px", borderRadius:"50%", background:"rgba(14,165,233,0.10)", filter:"blur(40px)", pointerEvents:"none" }} />

          <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#00d2c8", marginBottom: "14px" }}>
            Get Started Today
          </p>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: "900", letterSpacing: "-1px", margin: "0 0 16px" }}>
            Ready to fix things faster?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "420px", margin: "0 auto 36px", lineHeight: "1.7" }}>
            Join hundreds of organizations that trust MaintainPro to keep their facilities running smoothly.
          </p>
          <Link to="/register" className="btn-main" style={{
            background: "linear-gradient(135deg, #00d2c8, #0ea5e9)",
            color: "#001a1a", fontSize: "16px", fontWeight: "800",
            textDecoration: "none", padding: "15px 38px", borderRadius: "12px",
            boxShadow: "0 4px 28px rgba(0,210,200,0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "inline-block",
          }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 52px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "12px",
        maxWidth: "1120px", margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "7px",
            background: "linear-gradient(135deg,#00d2c8,#0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
          }}>⚙</div>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.45)" }}>MaintainPro</span>
        </div>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
          © 2026 · Built for modern organizations
        </span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Support"].map((l) => (
            <span key={l} style={{ fontSize: "13px", color: "rgba(255,255,255,0.30)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default Landing;
