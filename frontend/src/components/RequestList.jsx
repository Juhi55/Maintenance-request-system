import { useEffect, useState } from "react";
import API from "../services/api";

function RequestList({ requests: externalRequests }) {
  const [requests, setRequests] = useState([]);
  const role = localStorage.getItem("role");

  const fetchRequests = async () => {
    try {
      const res = await API.get("/maintenance");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests");
    }
  };

  useEffect(() => {
    if (externalRequests) {
      setRequests(externalRequests);
    } else {
      fetchRequests();
    }
  }, [externalRequests]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Maintenance Requests</h3>

      {requests.length === 0 && <p>No requests found.</p>}

      {requests.map((req) => (
        <div
          key={req._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "12px",
            background: "#fff",
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
            <strong>Status:</strong> {req.status}
          </p>

          {/* Show user info only for admin */}
          {role === "admin" && req.createdBy && (
            <p>
              <strong>User:</strong> {req.createdBy.name} (
              {req.createdBy.email})
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default RequestList;
