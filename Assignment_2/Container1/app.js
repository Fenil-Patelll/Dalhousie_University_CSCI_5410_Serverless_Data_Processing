// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('firebase-admin');
const serviceAccount = require('./sigma-rarity.json');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

// Initialize Firebase Admin SDK
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});
const db = fs.firestore();
const usersDb = db.collection('Reg');

const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(cookieParser()); // Parse cookies

// Handle POST request to create a new user
app.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const id = req.body.email;
        const userJson = {
            Name: req.body.firstName + ' ' + req.body.lastName,
            Location: req.body.city,
            Email: req.body.email,
            Password: await bcrypt.hash(req.body.password, 10)
        };
        const usersDb = db.collection('Reg');
        const response = await usersDb.doc(id).set(userJson);
        res.cookie('sessionID', id, { httpOnly: true });
        res.send(response);
    } catch (error) {
        res.send(error);
    }
});

module.exports = app;

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
