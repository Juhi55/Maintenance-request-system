import { useEffect, useState } from "react";
import API from "../services/api";

function RequestList() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/maintenance");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Maintenance Requests</h3>

      {requests.length === 0 && <p>No requests found.</p>}

      {requests.map((req) => (
        <div
          key={req._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{req.title}</h4>
          <p>Location: {req.location}</p>
          <p>Priority: {req.priority}</p>
          <p>Status: {req.status}</p>

          <button style={{ marginRight: "10px" }}>Edit</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default RequestList;
