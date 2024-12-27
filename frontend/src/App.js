import React from 'react';
import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './context/ProtectedRoute';
import Login from './Components/Login/Login';
import Todo from './Components/Todo/Todo';
import ToDoUpdate from './Components/ToDo Update/ToDoUpdate';

function App() {
  
  return (
    <AuthProvider>
      <Routes>
          <Route path='/' element={
              <div>
                <Login />
              </div>
          }
          />
         <Route path='/dashboard' element={
            <div>
              <ProtectedRoute />
                <Todo />
              <ProtectedRoute />
            </div>
        }
        />
        <Route path='/edit' element={
            <div>
              <ToDoUpdate />
            </div>
        }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
