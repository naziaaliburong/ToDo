import React, { useEffect, useState } from "react";
import "./ToDoUpdate.css";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

function ToDoUpdate (){
    const {id} = useParams();
    const [task, setTask] = useState("");
    const navigate = useNavigate();

    const fetchTodo = async () => {
        const res = await axios.get(`http://localhost:5000/todos/${id}`);
        console.log(res);
        setTask(res.data.list_name);
    };
    
    const handleUpdate = async() => {
        const res = await axios.put(`http://localhost:5000/update/${id}`, {listName: task});
        console.log(res);
        alert ("List updated successfully");
        navigate("/dashboard");
    };

    useEffect(()=>{
        fetchTodo();
    }, [id]);

    return(
        <div className="to-do-update">
            <input type="text" value={task} placeholder="edit todo" onChange={(e)=>setTask(e.target.value)}/>
            <button onClick={handleUpdate}>Update</button>
        </div>
    );

};

export default ToDoUpdate;