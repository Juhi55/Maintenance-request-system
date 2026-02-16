import { useEffect, useState } from "react";
import API from "../services/api";
import "../pages/dashboard.css"; // reuse card styling
import "../index.css";

function Reports() {
  const [report, setReport] = useState(null);
  const [filter, setFilter] = useState(null);

  const fetchReport = async () => {
    try {
      const res = await API.get("/reports");
      setReport(res.data);
    } catch (err) {
      alert("Access denied");
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/maintenance/${id}`, { status: newStatus });
      fetchReport();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;

    try {
      await API.delete(`/maintenance/${id}`);
      fetchReport();
    } catch (err) {
      alert("Error deleting request");
    }
  };

  if (!report) return <p>Loading report...</p>;

  // filtering
  let filtered = [];
  if (filter === "all") filtered = report.requests;
  if (filter === "pending")
    filtered = report.requests.filter((r) => r.status === "Pending");
  if (filter === "completed")
    filtered = report.requests.filter((r) => r.status === "Completed");

  return (
    <div className="dashboard">
      <h2>Admin Reports</h2>
      <p>Overview of all maintenance requests.</p>

      {/* Stats cards */}
      <div className="stats">
        <div className="card">
          <h3>{report.total}</h3>
          <p>Total Requests</p>
          <button onClick={() => setFilter("all")}>View</button>
        </div>

        <div className="card">
          <h3>{report.pending}</h3>
          <p>Pending</p>
          <button onClick={() => setFilter("pending")}>View</button>
        </div>

        <div className="card">
          <h3>{report.completed}</h3>
          <p>Completed</p>
          <button onClick={() => setFilter("completed")}>View</button>
        </div>
      </div>

      {/* Request list */}
      {filter && (
        <div className="request-list">
          <h3 className="request-title">Requests</h3>

          {filtered.length === 0 && <p>No requests found.</p>}

          {filtered.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-header">
                <h4>{req.title}</h4>
                <span className={`priority priority-${req.priority}`}>
                  {req.priority}
                </span>
              </div>

              <div className="request-details">
                <p>
                  <strong>Description:</strong> {req.description}
                </p>

                <p>
                  <strong>Location:</strong> {req.location}
                </p>

                <p>
                  <strong>User:</strong> {req.createdBy?.name} (
                  {req.createdBy?.email})
                </p>

                <p>
                  <strong>Status: </strong>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      updateStatus(req._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </p>

                <button
                  style={{
                    marginTop: "10px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteRequest(req._id)}
                >
                  Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports;
