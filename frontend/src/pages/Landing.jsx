import { Link } from "react-router-dom";
import "./landing.css";

function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <h2>MaintainPro</h2>
        <div>
          <Link to="/login" className="btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Register
          </Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Smart Maintenance Management System</h1>
        <p>
          Submit, track, and manage maintenance requests efficiently.
          Built for organizations to handle issues quickly and easily.
        </p>

        <Link to="/login" className="btn-primary large">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Landing;
