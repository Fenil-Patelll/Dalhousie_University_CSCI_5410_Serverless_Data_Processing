import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import LoginForm from './login';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ userEmail }) => {
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await axios.post('https://container3-i6trs4yawa-uc.a.run.app/logout', { email: userEmail });
      sessionStorage.removeItem('token');
      // Perform any additional logout-related tasks (e.g., clearing local storage, redirecting, etc.)
      setLoggedOut(true);
    } catch (error) {
      // Handle error
      console.log(error)
    }
  };

  useEffect(()=>{
    if (loggedOut) {
        navigate('/login');
        // return <LoginForm />;
      }
  })


  return (
    loggedOut?<div></div>:(<button onClick={handleLogout}>
      Logout
    </button>)
  );
};

export default LogoutButton;


