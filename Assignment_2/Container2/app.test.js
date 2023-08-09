const request = require('supertest');
const app = require('./app');
const bcrypt = require('bcrypt');
const fs = require('firebase-admin');
const serviceAccount = require('./sigma-rarity.json');

const appName = `test-app-${Date.now()}`;

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
}, appName);
const db = fs.firestore();
const usersDb = db.collection('Reg');

describe('Login', () => {
    test('should login a user', async () => {
        // Prepare test data
        const email = 'namo@dal.ca';
        const password = 'namo@12345';

        // Create a user in the database
        const userJson = {
            Name: 'Narendra',
            Location: 'Delhi',
            Email: email,
            Password: await bcrypt.hash(password, 10)
        };
        await usersDb.doc(email).set(userJson);

        // Perform the login request
        const response = await request(app)
            .post('/login')
            .send({ email, password });

        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body.userData).toBeDefined();
        expect(response.body.userData.Email).toBe(email);
        expect(response.headers['set-cookie']).toBeDefined();
        expect(response.headers['set-cookie'][0]).toContain('sessionID');

        // Cleanup: Delete the user from the database
        await usersDb.doc(email).delete();
    });

    test('should return 404 for non-existing user', async () => {
        // Perform the login request with a non-existing user
        const response = await request(app)
            .post('/login')
            .send({ email: 'nonexisting@example.com', password: 'password123' });

        // Assert the response
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    test('should return 401 for invalid password', async () => {
        // Prepare test data
        const email = 'namo@dal.ca';
        const password = 'namo@12345';

        // Create a user in the database
        const userJson = {
            Name: 'Narendra',
            Location: 'Delhi',
            Email: email,
            Password: await bcrypt.hash(password, 10)
        };
        await usersDb.doc(email).set(userJson);

        // Perform the login request with an invalid password
        const response = await request(app)
            .post('/login')
            .send({ email, password: 'wrongpassword' });

        // Assert the response
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid password');

        // Cleanup: Delete the user from the database
        await usersDb.doc(email).delete();
    });


});
