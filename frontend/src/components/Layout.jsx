import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const SIDEBAR_WIDTH = "240px";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/dashboard", icon: <FaHome />,     label: "Dashboard",      show: true },
    { to: "/create",    icon: <FaPlus />,     label: "Create Request", show: role === "user" },
    { to: "/reports",   icon: <FaChartBar />, label: "Reports",        show: role === "admin" },
  ];

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    }}>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.08);
        }
        .nav-link.active {
          color: #00d2c8;
          background: rgba(0,210,200,0.10);
          border-color: rgba(0,210,200,0.22);
          font-weight: 700;
        }
        .nav-link.active svg { filter: drop-shadow(0 0 6px #00d2c8); }
        .nav-icon {
          font-size: 15px; flex-shrink: 0;
          width: 18px; display: flex;
          align-items: center; justify-content: center;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          /* Clearly visible coral color */
          color: #fb7185;
          background: rgba(251,113,133,0.08);
          border: 1px solid rgba(251,113,133,0.18);
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
          font-family: inherit;
          text-align: left;
        }
        .logout-btn:hover {
          color: #fff;
          background: rgba(251,113,133,0.22);
          border-color: rgba(251,113,133,0.40);
        }
        .sidebar-fixed::-webkit-scrollbar { display: none; }
        .sidebar-fixed { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── FIXED Sidebar ── */}
      <aside
        className="sidebar-fixed"
        style={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: 0, left: 0,
          height: "100vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f2d 50%, #071a1a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 16px",
          zIndex: 100,
          boxSizing: "border-box",
        }}
      >
        {/* ── Top: Logo ── */}
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "10px",
          textDecoration: "none", marginBottom: "36px", padding: "0 8px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "linear-gradient(135deg, #00d2c8, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "17px", boxShadow: "0 0 16px rgba(0,210,200,0.35)", flexShrink: 0,
          }}>⚙</div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.4px" }}>
            MaintainPro
          </span>
        </Link>

        {/* ── Middle: Nav grows to fill space ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{
            fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            padding: "0 8px", margin: "0 0 10px", flexShrink: 0,
          }}>Navigation</p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navLinks.filter((l) => l.show).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
                {isActive(link.to) && (
                  <span style={{
                    marginLeft: "auto", width: "6px", height: "6px",
                    borderRadius: "50%", background: "#00d2c8",
                    boxShadow: "0 0 6px #00d2c8", flexShrink: 0,
                  }} />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Bottom: Divider + Logout always pinned ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "16px 0" }} />
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><FaSignOutAlt /></span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Scrollable main content ── */}
      <main style={{
        marginLeft: SIDEBAR_WIDTH,
        flex: 1,
        minHeight: "100vh",
        background: "linear-gradient(160deg, #eef2f7 0%, #e8f0f5 50%, #eaf4f4 100%)",
      }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
