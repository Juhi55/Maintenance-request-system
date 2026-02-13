import { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get("/reports");
        setReport(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Access denied");
      }
    };

    fetchReport();
  }, []);

  if (error) return <p>{error}</p>;
  if (!report) return <p>Loading report...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Maintenance Report</h2>
      <p>Total Requests: {report.total}</p>
      <p>Pending: {report.pending}</p>
      <p>In Progress: {report.inProgress}</p>
      <p>Completed: {report.completed}</p>
    </div>
  );
}

export default Reports;
