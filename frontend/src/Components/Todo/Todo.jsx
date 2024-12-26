import React, { useState } from "react";
import "./Todo.css"; // Create a CSS file for styling

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>ToDo Web App</h1>
      </div>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="New Item"
          className="todo-input"
        />
        <button onClick={addTask} className="add-button">+</button>
      </div>
      <ul className="todo-list">
        {tasks.map((task, index) => (
          <li key={index} className="todo-item">
            <input type="checkbox" className="todo-checkbox" />
            <span>{task}</span>
            <i class="bi bi-pencil"></i>
            <i class="bi bi-archive"></i>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
