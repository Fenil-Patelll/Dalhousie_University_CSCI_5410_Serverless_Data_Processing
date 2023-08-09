const request = require('supertest');
const app = require('./app');

// Mocking Firebase Admin SDK
jest.mock('firebase-admin', () => {
    // Mock Firestore functionality
    const firestore = {
        collection: jest.fn(() => firestore),
        doc: jest.fn(() => firestore),
        where: jest.fn(() => firestore),
        get: jest.fn(() => Promise.resolve({ docs: [] })),
        update: jest.fn(() => Promise.resolve()),
    };

    return {
        initializeApp: jest.fn(),
        firestore: jest.fn(() => firestore),
        credential: {
            cert: jest.fn(),
        },
    };
});

// Test suite for Online Users
describe('Online Users', () => {
    // Test case: should retrieve online users
    it('should retrieve online users', async () => {
        // Mock data for online users
        const mockData = [
            {
                email: 'gaurav@nirma.in',
                status: 'online',
                timestamp: '2023-07-04T19:08:50.987Z',
            },
        ];

        // Mock the Firestore "get" method to return the mock data
        const mockGet = jest.fn(() => Promise.resolve({ docs: mockData }));

        // Mock the app.locals with the necessary mock implementations
        app.locals = {
            stateDb: {
                where: jest.fn(() => app.locals.stateDb),
                get: mockGet,
            },
            usersDb: {
                doc: jest.fn(() => app.locals.usersDb),
                get: jest.fn(() => Promise.resolve({ data: () => ({ Name: 'gaurav panchal', Location: 'ahmedabad' }) })),
            },
        };

        // Make a request to the "/online-users" endpoint
        const response = await request(app).get('/online-users');

        // Assert that the response status is 200
        expect(response.status).toBe(200);
    });
});
