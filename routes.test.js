const request = require('supertest'); // Only for DEV env -- Installed with npm install supertest --save-dev
const app = require('./routes');
const Settings = require('./settings'); // Github client API Calls


describe('Settings', () => {
    test('GITHUB_CLIENT_ID is not empty string', async () => {
        const setting_GITHUB_CLIENT_ID = Settings.GITHUB_CLIENT_ID.length;
        expect(setting_GITHUB_CLIENT_ID).toBeGreaterThan(0);
    });

    test('GITHUB_CLIENT_SECRET is not empty string', async () => {
        const setting_GITHUB_CLIENT_SECRET = Settings.GITHUB_CLIENT_SECRET.length;
        expect(setting_GITHUB_CLIENT_SECRET).toBeGreaterThan(0);
    });

    test('SUPER_SECRET_KEY is not empty string', async () => {
        const setting_SUPER_SECRET_KEY = Settings.SUPER_SECRET_KEY.length;
        expect(setting_SUPER_SECRET_KEY).toBeGreaterThan(0);
    });

})

describe('Home page', () => {
    test('Home page - not logged redirect to login', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(302);
    });

    test('Login response is 200', async () => {
        const response = await request(app).get('/login');
        expect(response.statusCode).toBe(200);
    });

    test('Callback without code in query fail ', async () => {
        const response = await request(app)
                               .get('/callback');
        expect(response.statusCode).toBe(302);
    });

    test('302 Callback with a wrong code fail ', async () => {
        const response = await request(app)
                               .get('/callback?code=bananacode');                    
        expect(response.statusCode).toBe(302);
       
    });


    test('Callback with a wrong code redirect to login ', async () => {
        const response = await request(app)
                               .get('/callback?code=bananacode');                    
        expect(response.headers.location).toBe("/login");
       
    });

    
    /* 
      Work in Progress
      test still in progress
    */

})