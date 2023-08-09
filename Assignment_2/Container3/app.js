// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('firebase-admin');
const serviceAccount = require('./sigma-rarity.json');
const cookieParser = require('cookie-parser');

// Initialize Firebase Admin SDK
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

// Access Firestore collections
const db = fs.firestore();
const stateDb = db.collection('state');
const usersDb = db.collection('Reg');

// Create Express application
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Get online users route
app.get('/online-users', async (req, res) => {
    try {
        // Retrieve sessionID from the cookie
        const sessionID = req.cookies.sessionID;

        // Query the "state" collection to get online users
        const query = await stateDb.where('status', '==', 'online').get();

        // Retrieve user data for each online user
        const onlineUsers = [];
        const promises = query.docs.map(async (doc) => {
            const email = doc.data().email;
            const regDoc = await usersDb.doc(email).get();
            const userData = regDoc.data();
            onlineUsers.push(userData);
        });

        await Promise.all(promises);

        // Send the online users data in the response
        res.send({ onlineUsers: onlineUsers });

    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});

// Logout route
app.post('/logout', async (req, res) => {
    try {
        // Retrieve email from the request body
        const email = req.body.email;

        // Update the user's status in the "state" collection to "offline"
        const stateDoc = stateDb.doc(email);
        await stateDoc.update({ status: 'offline' });

        // Clear the sessionID cookie and send the success message in the response
        res.clearCookie('sessionID');
        res.send({ message: 'Logout successful' });

    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the app
module.exports = app;
