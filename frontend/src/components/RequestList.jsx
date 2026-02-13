function RequestList() {
  // Temporary dummy data
  const requests = [
    {
      id: 1,
      title: "AC not working",
      location: "Room 101",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      title: "Broken chair",
      location: "Lab 2",
      priority: "Medium",
      status: "Pending",
    },
  ];

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Maintenance Requests</h3>

      {requests.map((req) => (
        <div
          key={req.id}
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
