import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/maintenance", {
        title,
        description,
        location,
        priority,
      });

      alert("Request created successfully");
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating request");
    }
  };

  return (
    <div className="create-container">
      <div className="create-card">
        <h2>Create Maintenance Request</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Request Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;
