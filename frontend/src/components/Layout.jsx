import { Link, useNavigate } from "react-router-dom";
import "./layout.css";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2>System</h2>
        <Link to="/home">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reports">Reports</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
}

export default Layout;
