import { useEffect, useState } from "react";
import API from "../services/api";
import RequestList from "../components/RequestList";
import "./dashboard.css";

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState(null); // null = no list shown

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

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const completed = requests.filter((r) => r.status === "Completed").length;

  // Filter logic
  let filteredRequests = [];
  if (filter === "all") {
    filteredRequests = requests;
  } else if (filter === "pending") {
    filteredRequests = requests.filter((r) => r.status === "Pending");
  } else if (filter === "completed") {
    filteredRequests = requests.filter((r) => r.status === "Completed");
  }

  return (
    <div className="dashboard">
      <h2>Welcome back!</h2>
      <p>Here is a quick overview of your maintenance requests.</p>

      <div className="stats">
        <div className="card">
          <h3>{total}</h3>
          <p>Total Requests</p>
          <button onClick={() => setFilter("all")}>View</button>
        </div>

        <div className="card">
          <h3>{pending}</h3>
          <p>Pending</p>
          <button onClick={() => setFilter("pending")}>View</button>
        </div>

        <div className="card">
          <h3>{completed}</h3>
          <p>Completed</p>
          <button onClick={() => setFilter("completed")}>View</button>
        </div>
      </div>

      {/* Show list only if a card is clicked */}
      {filter && (
        <RequestList requests={filteredRequests} />
      )}
    </div>
  );
}

export default Dashboard;
