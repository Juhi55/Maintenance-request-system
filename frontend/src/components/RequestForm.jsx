import { useState } from "react";
import API from "../services/api";

function RequestForm({ onRequestAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/maintenance", {
        title,
        description,
        location,
        priority,
      });

      alert("Request created");

      // Clear form
      setTitle("");
      setDescription("");
      setLocation("");
      setPriority("Low");

      // Notify dashboard
      if (onRequestAdded) {
        onRequestAdded(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating request");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>New Maintenance Request</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>Priority: </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <br />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default RequestForm;
