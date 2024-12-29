import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Todo.css"; // Create a CSS file for styling

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
 
  const fetchLists = async () => {
    try{
      const response = await axios.get('http://localhost:5000/lists', {withCredentials: true});
      setTasks (response.data);
    } catch(err) {
      console.log("error fetching lists");
    }
  };

  useEffect(() => {
    fetchLists();
  },[]);


  async function addTask (){
    await axios.post('http://localhost:5000/create', {listName: newTask}, { withCredentials: true });
    alert("list added to db");
    fetchLists();
    setNewTask(""); 
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:5000/delete/${id}`);
      alert("List deleted successfully!");
      fetchLists();
      } catch (err) {
        console.error("Failed to delete list");
      }
  };

  return (
    <div>
    <h1 className="heading">To Do Web App</h1>
    <div className="todo-container">
      <div className="todo-header">
        <h1>Enter your todo list:</h1>
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
        {tasks.map((task) => (
          <li key={task.id}  className="todo-item">
            <div>
              <input type="checkbox" className="todo-checkbox" />
              <span>{task.list_name}</span>
            </div>
            <div>
              <Link to={`/edit/${task.id}`} ><i className="bi bi-pencil"></i></Link>
              <i className="bi bi-archive" onClick={() => handleDelete(task.id)}></i>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default TodoList;
