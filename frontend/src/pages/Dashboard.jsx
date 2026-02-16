import { useEffect, useState } from "react";
import API from "../services/api";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";
import "./dashboard.css";

function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleRequestAdded = () => {
    setRefresh(!refresh);
  };

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
  }, [refresh]);

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const completed = requests.filter((r) => r.status === "Completed").length;

  // Filtered list
  let filteredRequests = requests;
  if (filter === "pending") {
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

      <RequestForm onRequestAdded={handleRequestAdded} />

      <RequestList
        requests={filteredRequests}
        refresh={refresh}
      />
    </div>
  );
}

export default Dashboard;
