const request = require('supertest'); // Only for DEV env -- Installed with npm install supertest --save-dev
const app = require('./routes');

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