import { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {
  const [report, setReport] = useState(null);

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
      await API.put(`/maintenance/${id}`, {
        status: newStatus,
      });
      fetchReport(); // refresh data
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="container">
      <h2>Admin Reports</h2>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>Total:</strong> {report.total}</p>
        <p><strong>Pending:</strong> {report.pending}</p>
        <p><strong>In Progress:</strong> {report.inProgress}</p>
        <p><strong>Completed:</strong> {report.completed}</p>
      </div>

      <h3>All Requests</h3>

      {report.requests.length === 0 && <p>No requests found.</p>}

      {report.requests.map((req) => (
        <div
          key={req._id}
          style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h4>{req.title}</h4>

          <p>
            <strong>Description:</strong> {req.description}
          </p>

          <p>
            <strong>Location:</strong> {req.location}
          </p>

          <p>
            <strong>Priority:</strong> {req.priority}
          </p>

          <p>
            <strong>Requested by:</strong>{" "}
            {req.createdBy?.name} ({req.createdBy?.email})
          </p>

          <div style={{ marginTop: "10px" }}>
            <strong>Status:</strong>{" "}
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reports;
