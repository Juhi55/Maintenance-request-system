import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "15px", color: "#fff" }}>
        Login
      </Link>
      <Link to="/register" style={{ marginRight: "15px", color: "#fff" }}>
        Register
      </Link>
      <Link to="/dashboard" style={{ color: "#fff" }}>
        Dashboard
      </Link>
    </nav>
  );
}

export default Navbar;
