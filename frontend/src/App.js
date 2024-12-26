import React from 'react';
import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './Components/Login/Login';
import Todo from './Components/Todo/Todo';
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
              <Todo />
            </div>
        }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
