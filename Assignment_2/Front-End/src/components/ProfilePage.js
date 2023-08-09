import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutButton from './logout';
import axios from 'axios';

const ProfilePage = () => {
  const location = useLocation();
  const userData = location.state.userData.userData;
  const onlineUsers = location.state.onlineUsers;

  const otherOnlineUsers = onlineUsers.filter((user) => user.Email !== userData.Email);
  const navigate = useNavigate();
  const tokencheck = userData.Email;

  useEffect(() => {
    const handleTabClose = async () => {
      try {
        // Make an HTTP request to update the user status to "offline"
        await axios.post('https://container3-i6trs4yawa-uc.a.run.app/logout', { email: userData.Email });
        console.log("tab close worked")
      } catch (error) {
        console.error('Failed to update user status:', error);
      }
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [userData.Email]);


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!(token===tokencheck)) {
      navigate('/login');
    }
  }, [navigate,tokencheck]);  

    return (
        <div>
            <h3>User Profile</h3>
            <p>Hi, <b>{userData.Name}</b> you are logged in with <b>{userData.Email}</b> email id</p>
            <div style={{marginBottom:'7px'}}><LogoutButton userEmail={userData.Email} /></div>
            <div>
            <h5>Here are other users who are Online:</h5>
            {otherOnlineUsers.map((user, index) => (
      <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }} >
        <p>Name: {user.Name}</p>
        <p>Location: {user.Location}</p>
        <p>Email: {user.Email}</p>
      </div>
    ))}
      </div>
        </div>
    
    );
};
export default ProfilePage;
