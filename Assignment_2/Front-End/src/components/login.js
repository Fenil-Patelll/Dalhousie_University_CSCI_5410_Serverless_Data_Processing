// export default LoginForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://container2-i6trs4yawa-uc.a.run.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  email, password }),
    });

    if (response.ok) {
    const data = await response.json();
    // const { token } = data;

    sessionStorage.setItem('token', data.userData.Email);
      // Redirect to profile listing page on successful login

  axios.get('https://container3-i6trs4yawa-uc.a.run.app/online-users')
  .then(response => {
    // Handle the response data
    const onlineUsers = response.data.onlineUsers;
    console.log(onlineUsers);
    navigate('/profile-page', { state: { userData: data , onlineUsers: onlineUsers} });
      
    console.log(response)
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });


    } else {
      // Handle login error
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />    
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            value={password}
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
