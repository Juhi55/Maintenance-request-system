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
    <div className="request-list">
      

      {requests.length === 0 && <p>No requests found.</p>}

      {requests.map((req) => (
        <div key={req._id} className="request-card">
          <div className="request-header">
            <h4>{req.title}</h4>

            {/* Priority badge */}
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
              <strong>Status: </strong>
              <span
                className={`status ${
                  req.status === "Pending"
                    ? "status-pending"
                    : req.status === "In Progress"
                    ? "status-progress"
                    : "status-completed"
                }`}
              >
                {req.status}
              </span>
            </p>

            {/* Admin-only user info */}
            {role === "admin" && req.createdBy && (
              <p>
                <strong>User:</strong> {req.createdBy.name} (
                {req.createdBy.email})
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RequestList;
