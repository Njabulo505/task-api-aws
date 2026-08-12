import { useState } from "react";

const API = "http://127.0.0.1:8000";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Register
  const register = async () => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(res.ok ? "Registered successfully" : data.detail || "Registration failed");
  };

  // Login (just show token, don’t auto‑store)
  const login = async () => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.detail || "Invalid credentials");
    return;
  }

  // ✅ Always take token from API response
  setToken(data.access_token);
};


  // Fetch tasks (requires manual token entry)
 const fetchTasks = async () => {
  const res = await fetch(`${API}/tasks/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json(); // read once

  if (!res.ok) {
    alert(data.detail || "Authorization failed");
    return;
  }

  setTasks(Array.isArray(data) ? data : []);
};


  // Create task
  const createTask = async () => {
    const res = await fetch(`${API}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.detail || "Could not create task");
      return;
    }
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.detail || "Could not delete task");
      return;
    }
    fetchTasks();
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>
      <h1>Task Manager</h1>

      <h2>Register / Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <br /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      <hr />
      <h2>Enter Token</h2>
      <input placeholder="Paste token here" value={token} onChange={e => setToken(e.target.value)} />
      <button onClick={fetchTasks}>Fetch Tasks</button>

      <hr />
      <h2>Create Task</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <br /><br />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <br /><br />
      <button onClick={createTask}>Create Task</button>

      <hr />
      <h2>Tasks</h2>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
