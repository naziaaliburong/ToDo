import React, { useState } from "react";
import { useAuth } from '../../context/AuthProvider';
import axios from "axios";
import './Login.css';
import { useNavigate } from "react-router-dom";

function Login(){
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loginClick, setLoginClick] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    
    function handleSignupClick(){
        setLoginClick(false);
    }
    function handleLoginClick(){
        setLoginClick(true);
    }
    function handleClose(){
        setIsModalOpen(false);
        setLoginClick(true);
    }

    async function handleLogin() {
        try {
            // Await the axios post request for login
            await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true });
            // If the request is successful, close the modal and show a success message
            setIsModalOpen(false);
            alert('Login successful, now you can create listings');
            login(); // Set the user as authenticated
            navigate('/dashboard');
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Incorrect username or password');
            } else {
                // Handle other types of errors (e.g., network or server issues)
                alert('Something went wrong. Please try again later.');
            }
        }
    }

    async function handleSignup() {
        try {
            // Await the axios post request for signup
            await axios.post('http://localhost:5000/signup', { email, password });
    
            // If the request is successful, close the modal and show a success alert
            setIsModalOpen(false);
            alert('Signup successful');  // Simple alert, no input required
        } catch (error) {
            // If there is an error, show an error alert
            alert('Signup error');  // Simple alert, no input required
        }
    }

    return(
    <div>
        
        {isModalOpen && (
            <div className='login-modal'>
                <div className='login-signup'>
                    <div className='log-sign-btn'>
                        <button className={loginClick && 'selected-btn-color'} onClick={handleLoginClick}>Login</button>
                        <button className={!loginClick && 'selected-btn-color'} onClick={handleSignupClick}>Signup</button>
                    </div>
                    <div className='icon'>
                        <i className='bi bi-x-square' onClick={handleClose}></i>
                    </div>
                </div>

                
                {loginClick ? (
                <div>
                    <div className='email-password'>
                        <input placeholder='Email ID' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div className='checkbox'>
                        <div>
                            <input type='checkbox'/>
                            <label>Remember Me</label>
                        </div>
                        <div>
                            <p>Forgot Password?</p>
                        </div>
                    </div>
                    <div className='login-btn'>
                        <button onClick={handleLogin}>Login</button>
                    </div>
                    <div className='hr-p'>
                    <hr/>
                    <p>OR</p>
                    <hr/>
                    </div>
                    <div className='oAuth-btn'>
                        <button><a href='http://localhost:5000/auth/facebook'>Login with Facebook</a></button>
                        <button><a href='http://localhost:5000/auth/google'>Login with Google</a></button>
                    </div>
                </div>
                ):(
                    <div>
                    <div className='email-password'>
                        <input placeholder='Email ID' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div className='signup-btn'>
                        <button onClick={handleSignup}>Sign Up</button>
                    </div>
                    <div className='hr-p'>
                    <hr/>
                    <p>OR</p>
                    <hr/>
                    </div>
                    <div className='oAuth-btn'>
                        <button><a href='http://localhost:5000/auth/facebook'>Signup with Facebook</a></button>
                        <button><a href='http://localhost:5000/auth/google'>Signup with Google</a></button>
                    </div>
                </div>
                )}
            </div>
        )}
    </div>
    );
};

export default Login;

