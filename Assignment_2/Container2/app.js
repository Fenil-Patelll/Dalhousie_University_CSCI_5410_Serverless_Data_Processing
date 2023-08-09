// Import required modules
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('firebase-admin');
const serviceAccount = require('./sigma-rarity.json');
const bcrypt = require('bcrypt');

// Initialize Firebase Admin SDK
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

// Access Firestore collections
const db = fs.firestore();
const usersDb = db.collection('Reg');
const stateDb = db.collection('state');

// Create Express application
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Login route
app.post('/login', async (req, res) => {
    try {
        // Retrieve email and password from the request body
        const email = req.body.email;
        const password = req.body.password;

        // Fetch user data from the Firestore collection
        const userObj = await usersDb.doc(email).get();

        // Check if the user exists
        if (!userObj.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Retrieve stored password from user data
        const userData = userObj.data();
        const storedPassword = userData.Password;
        // Compare the provided password with the stored password
        const passwordMatch = await bcrypt.compare(password, storedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Password is valid, proceed with login logic
        // Update the user's status in the "state" collection of Firestore
        const stateData = {
            email: email,
            status: 'online',
            timestamp: new Date().toISOString()
        };
        const response = await stateDb.doc(email).set(stateData);

        // Set sessionID cookie and send user data in the response
        res.cookie('sessionID', email, { httpOnly: true });
        res.send({ userData: userData });

    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});

// Export the app
module.exports = app;

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
