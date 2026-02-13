import { useState } from "react";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";

function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  const handleRequestAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Welcome to the maintenance system.</p>

      <RequestForm onRequestAdded={handleRequestAdded} />
      <RequestList key={refresh} />
    </div>
  );
}

export default Dashboard;
