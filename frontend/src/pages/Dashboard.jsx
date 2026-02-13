import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Welcome to the maintenance system.</p>

      <RequestForm />
      <RequestList />
    </div>
  );
}

export default Dashboard;
