const request = require('supertest');
const app = require('./app'); // Import the main app file

describe('Registration', () => {
    test('should register a new user', async () => {
        // Define the user data for registration
        const userData = {
            firstName: 'Narendra',
            lastName: 'Modi',
            email: 'namo@dal.ca',
            password: 'namo@12345',
            city: 'Delhi',
        };

        // Send a POST request to the '/create' endpoint with the user data
        const response = await request(app)
            .post('/create')
            .send(userData);

        // Assert the response
        expect(response.status).toBe(200); // Expect the response status to be 200 (OK)
        expect(response.body).toEqual(expect.anything()); // Expect the response body to be defined and not empty
    });
});
