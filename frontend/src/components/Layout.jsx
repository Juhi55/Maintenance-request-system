import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import "./layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <Link to="/" className="logo">
         MaintainPro
         </Link>


        <Link to="/dashboard">
          <FaHome style={{ marginRight: "8px" }} />
          Dashboard
        </Link>

        {role === "user" && (
          <Link to="/create">
            <FaPlus style={{ marginRight: "8px" }} />
            Create Request
          </Link>
        )}

        {role === "admin" && (
          <Link to="/reports">
            <FaChartBar style={{ marginRight: "8px" }} />
            Reports
          </Link>
        )}

        <button onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "6px" }} />
          Logout
        </button>
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
}

export default Layout;
