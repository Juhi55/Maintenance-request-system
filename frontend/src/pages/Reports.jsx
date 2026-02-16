import { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get("/reports");
        setReport(res.data);
      } catch (err) {
        alert("Access denied");
      }
    };

    fetchReport();
  }, []);

  if (!report) return <p>Loading report...</p>;

  return (
    <div>
      <h2>Admin Reports</h2>

      <p>Total: {report.total}</p>
      <p>Pending: {report.pending}</p>
      <p>In Progress: {report.inProgress}</p>
      <p>Completed: {report.completed}</p>

      <h3 style={{ marginTop: "20px" }}>All Requests</h3>

      {report.requests.map((req) => (
        <div
          key={req._id}
          style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <h4>{req.title}</h4>
          <p><strong>Description:</strong> {req.description}</p>
          <p><strong>Location:</strong> {req.location}</p>
          <p><strong>Priority:</strong> {req.priority}</p>
          <p><strong>Status:</strong> {req.status}</p>

          <p>
            <strong>Requested by:</strong>{" "}
            {req.createdBy?.name} ({req.createdBy?.email})
          </p>
        </div>
      ))}
    </div>
  );
}

export default Reports;
