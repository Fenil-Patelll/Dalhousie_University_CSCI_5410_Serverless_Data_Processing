import React, { Component } from 'react'
// import ProfilePage from "./ProfilePage";
import LoginForm from './login';
export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            city: '',
            submitted: false,
            showNotification: '',
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: '',
            },
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            const { firstName, lastName, email, password, confirmPassword,city } = this.state;
            const formData = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            city
            };
    
            fetch('https://container1-i6trs4yawa-uc.a.run.app/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Handle the response from the server
                  console.log(data);
                  this.setState({ submitted: true, showNotification: true });
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
                
                alert("Successfully Registered")

                console.log('Form submitted successfully');

                this.setState({ submitted: true , showNotification: true});
            };

        }


    validateForm = () => {
        const { firstName, lastName, email, password, confirmPassword,city } = this.state;
        let errors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            city: ''
        };
        let isValid = true;

        // Validate First Name
        if (!firstName.match(/^[a-zA-Z]+$/)) {
            isValid = false;
            errors.firstName = 'First Name should contain only letters';
        }

        // Validate Last Name
        if (!lastName.match(/^[a-zA-Z]+$/)) {
            isValid = false;
            errors.lastName = 'Last Name should contain only letters';
        }

        // Validate Email
        if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            isValid = false;
            errors.email = 'Please enter a valid email address';
        }

        // Validate Password
        if (password.length < 8) {
            isValid = false;
            errors.password = 'Password should be at least 8 characters long';
        }

        // Validate Confirm Password
        if (password !== confirmPassword) {
            isValid = false;
            errors.confirmPassword = 'Passwords do not match';
        }

        // Validate Password
        if (!password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
            isValid = false;
            errors.password = 'Password should be at least 8 characters long and include at least one alpha-numeric and special characters.';
        }

        if (!city.match(/^[a-zA-Z]+$/)) {
            isValid = false;
            errors.city = 'City Name should contain only letters';
        }


        this.setState({ errors });
        return isValid;
    };

    render() {
        const { firstName, lastName, email, password, confirmPassword,city, submitted, errors, showNotification } = this.state;

        if (submitted) {
            return (
                <LoginForm onLogin={this.handleLogin} />
            );
        }

        return (
            <div>
            {showNotification && (
                <div
                    style={{
                        position: 'fixed',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff',
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <p>Registration Successful!</p>
                </div>
            )}
            <form onSubmit={this.handleSubmit}>
                <h3>Sign Up</h3>
                <div className="mb-3">
                    <label>First name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        name="firstName"
                        value={firstName}
                        onChange={this.handleChange}
                        required
                    />
                    {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                </div>
                <div className="mb-3">
                    <label>Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        name="lastName"
                        value={lastName}
                        onChange={this.handleChange}
                        required
                    />
                    {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                </div>
                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        required
                    />
                    {errors.email && <span className="text-danger">{errors.email}</span>}
                </div>
                <div className="mb-3">
                    <label>City</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="City name"
                        name="city"
                        value={city}
                        onChange={this.handleChange}
                        required
                    />
                    {errors.city && <span className="text-danger">{errors.city}</span>}
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        minLength="8"
                        required
                    />
                    {errors.password && <span className="text-danger">{errors.password}</span>}
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        minLength="8"
                        required
                    />
                    {errors.confirmPassword && (
                        <span className="text-danger">{errors.confirmPassword}</span>
                    )}
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Sign Up
                    </button>
                </div>
                <p className="forgot-password text-right">
                    Already registered <a href="/login">Sign In?</a>
                </p>
            </form>
                {submitted && <p>Registration successful!</p>}
            </div>
        );
    }
}
