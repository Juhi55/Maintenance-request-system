import { useState } from "react";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";

function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  const handleRequestAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="container">
      <h2>Maintenance Dashboard</h2>
      <p>Submit and manage maintenance requests.</p>

      <RequestForm onRequestAdded={handleRequestAdded} />
      <RequestList key={refresh} />
    </div>
  );
}

export default Dashboard;
