import RequestForm from "../components/RequestForm";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Welcome to the maintenance system.</p>

      <RequestForm />
    </div>
  );
}

export default Dashboard;
