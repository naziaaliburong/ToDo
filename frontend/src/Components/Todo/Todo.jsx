import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Todo.css"; // Create a CSS file for styling
import { useNavigate } from "react-router-dom";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try{
        const response = await axios.get('http://localhost:5000/lists', {withCredentials: true});
        console.log(response.data);
        setTasks (response.data);
      } catch(err) {
        console.log("error fetching lists");
      }
    };
    fetchLists();
  },[]);

  async function addTask (){
   
    console.log(newTask);
    const response = await axios.post('http://localhost:5000/create', {listName: newTask}, { withCredentials: true });
    if(response.data.message){
      alert("list added to db");
    }
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };
  function editHandler () {
    navigate("/edit");
  }

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
        {tasks.map((task, index) => (
          <li key={index} className="todo-item">
            <div>
              <input type="checkbox" className="todo-checkbox" />
              <span>{task}</span>
            </div>
            <div>
              <i className="bi bi-pencil" onClick={editHandler}></i>
              <i className="bi bi-archive"></i>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default TodoList;
