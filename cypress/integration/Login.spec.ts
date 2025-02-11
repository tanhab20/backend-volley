describe('Login API Tests', () => {

    const adminUser = { username: 'admin', password: 'admin' };
    const regularUser = { username: 'user', password: 'user' };
    const invalidUser = { username: 'invalid', password: 'wrongpassword' };

    it('should successfully login with admin credentials', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login', // Setze die URL deines Endpoints
            body: adminUser,
            failOnStatusCode: false, // Verhindert, dass der Test fehlschlägt, wenn der Statuscode nicht 2xx ist
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('accessToken');
            expect(response.body).to.have.property('roleToken');
            // Optionale Überprüfung der Token-Struktur, falls gewünscht
            expect(response.body.accessToken).to.be.a('string');
            expect(response.body.roleToken).to.be.a('string');
        });
    });

    it('should successfully login with regular user credentials', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login', // Setze die URL deines Endpoints
            body: regularUser,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('accessToken');
            expect(response.body).to.have.property('roleToken');
            expect(response.body.accessToken).to.be.a('string');
            expect(response.body.roleToken).to.be.a('string');
        });
    });

    it('should return 401 for invalid username or password', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: invalidUser,
            failOnStatusCode: false, // Wir erwarten hier einen Fehler
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('no user');
        });
    });

    it('should return 401 for missing user data (empty body)', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: {},
            failOnStatusCode: false, // Wir erwarten hier einen Fehler
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('no user');
        });
    });

});
