import { useEffect, useState } from "react";
import API from "../services/api";

function RequestList({ requests: externalRequests }) {
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
    if (externalRequests) {
      setRequests(externalRequests);
    } else {
      fetchRequests();
    }
  }, [externalRequests]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/maintenance/${id}`);
      fetchRequests();
    } catch (err) {
      alert("Error deleting request");
    }
  };

  const handleEdit = async (req) => {
    const newTitle = prompt("Enter new title", req.title);
    if (!newTitle) return;

    try {
      await API.put(`/maintenance/${req._id}`, {
        title: newTitle,
      });
      fetchRequests();
    } catch (err) {
      alert("Error updating request");
    }
  };

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
            background: "#fff",
            borderRadius: "6px",
          }}
        >
          <h4>{req.title}</h4>
          <p>Location: {req.location}</p>
          <p>Priority: {req.priority}</p>
          <p>Status: {req.status}</p>

          <button
            style={{ marginRight: "10px" }}
            onClick={() => handleEdit(req)}
          >
            Edit
          </button>

          <button onClick={() => handleDelete(req._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default RequestList;
