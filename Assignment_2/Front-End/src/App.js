import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/signup';
import ProfilePage from './components/ProfilePage';
import LoginForm from './components/login';

class App extends Component {
  state = {
    isSignedUp: false,
    isLoggedIn: false,
    firstName: '',
    lastName: '',
    email: '',
  };

  handleSignUp = (firstName, lastName, email) => {
    this.setState({
      isSignedUp: true,
      firstName,
      lastName,
      email,
    });
  };

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  };

  render() {
    const { isSignedUp} = this.state;

    return (
      <Router>
        <div className="App">
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Routes>
                <Route
                  path="/"
                  element={
                    isSignedUp ? (
                      <Navigate to="/login" />
                      //<Navigate to="/profile-page" />
                    ) : (
                      <SignUp onSignUp={this.handleSignUp} />
                    )
                  }
                />
                <Route
                  path="/profile-page"
                  element={
                      <ProfilePage/>
                  }
                />
                <Route
                  path="/login"
                  element={<LoginForm onLogin={this.handleLogin} />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
