import { Link, useNavigate } from "react-router-dom";
import "./layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2>System</h2>
        <Link to="/dashboard">Dashboard</Link>

        {role === "admin" && (
          <Link to="/reports">Reports</Link>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
}

export default Layout;
