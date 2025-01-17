"use strict";
describe('Tournament API Tests', () => {
    it('should fetch all tournaments', () => {
        cy.request('GET', 'http://localhost:4000/tournaments')
            .its('status')
            .should('equal', 200);
    });
    it('should return 500 for missing required fields', () => {
        const incompleteTournament = {
            date: new Date().toISOString(),
            location: 'Hamburg',
            duration: 2,
            description: 'Ein aufregendes Turnier.',
        };
        cy.request({
            method: 'POST',
            url: 'http://localhost:4000/tournaments',
            body: incompleteTournament,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body).to.have.property('error', 'Fehler beim Erstellen des Turniers');
        });
    });
    it('should fetch a specific tournament by ID', () => {
        const tournamentToFetch = {
            name: 'Hallenmeisterschaft',
            date: new Date().toISOString(),
            location: 'Köln',
            duration: 2,
            description: 'Ein Hallenturnier mit Teams aus ganz Deutschland.',
        };
        cy.request('POST', 'http://localhost:4000/tournaments', tournamentToFetch).then((postResponse) => {
            const { _id } = postResponse.body;
            expect(_id).to.match(/^[a-f\d]{24}$/i);
            cy.request('GET', `http://localhost:4000/tournaments/${_id}`).then((getResponse) => {
                expect(getResponse.status).to.eq(200);
                expect(getResponse.body).to.have.property('_id', _id);
                expect(getResponse.body).to.have.property('name', tournamentToFetch.name);
            });
        });
    });
    //it('should update a tournament successfully', () => {
    //    const initialTournament = {
    //        name: 'Oster-Pokal',
    //        date: new Date().toISOString(),
    //        location: 'Leipzig',
    //        duration: 3,
    //        description: 'Ein aufregendes Turnier rund um die Osterzeit.',
    //    };
    //
    //    cy.request('POST', 'http://localhost:4000/tournaments', initialTournament).then((postResponse) => {
    //        const { _id } = postResponse.body;
    //
    //        const updatedTournament = {
    //            name: 'Aktualisiertes Turnier',
    //            date: new Date().toISOString(),
    //            location: 'Hamburg',
    //            duration: 3,
    //            description: 'Beschreibung nach der Aktualisierung.',
    //        };
    //
    //        cy.request({
    //            method: 'PUT',
    //            url: `http://localhost:4000/tournaments/${_id}`,
    //            body: updatedTournament,
    //            failOnStatusCode: false,  // Allow the test to continue even if the request fails
    //        }).then((putResponse) => {
    //            console.log(putResponse);  // Log the response to check the status and body for debugging
    //            expect(putResponse.status).to.eq(200);
    //        });
    //    });
    //});
    it('should delete a tournament successfully', () => {
        const newTournament = {
            name: 'Turnier zum Löschen',
            date: new Date().toISOString(),
            location: 'Berlin',
            duration: 2,
            description: 'Dies ist ein Test-Turnier, das gelöscht wird.',
        };
        cy.request('POST', 'http://localhost:4000/tournaments', newTournament).then((postResponse) => {
            const { _id } = postResponse.body;
            cy.request('DELETE', `http://localhost:4000/tournaments/${_id}`)
                .its('status')
                .should('equal', 200);
        });
    });
    it('should return 404 for a non-existent tournament ID', () => {
        const nonExistentID = '64c3f8e7b4569e001e62e6aa';
        cy.request({
            method: 'GET',
            url: `http://localhost:4000/tournaments/${nonExistentID}`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error', 'Turnier nicht gefunden');
        });
    });
    it('should create a tournament successfully', () => {
        const newTournament = {
            name: 'Sommer-Cup',
            date: new Date().toISOString(),
            location: 'München',
            duration: 3,
            description: 'Ein spannendes Turnier für Sommerliebhaber.',
        };
        cy.request('POST', 'http://localhost:4000/tournaments', newTournament).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', newTournament.name);
            expect(response.body).to.have.property('description', newTournament.description);
        });
    });
    it('should return correct response structure when creating a tournament', () => {
        const newTournament = {
            name: 'Frühjahrsmeisterschaft',
            date: new Date().toISOString(),
            location: 'Frankfurt',
            duration: 4,
            description: 'Ein aufregendes Turnier im Frühling.'
        };
        cy.request('POST', 'http://localhost:4000/tournaments', newTournament).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', newTournament.name);
            expect(response.body).to.have.property('date');
            expect(response.body).to.have.property('location', newTournament.location);
            expect(response.body).to.have.property('duration').and.equal(`${newTournament.duration}`); // Erwartung als String
            expect(response.body).to.have.property('description', newTournament.description);
        });
    });
    //it('should fetch only future tournaments based on the date', () => {
    //    // Turniere erstellen (eins in der Vergangenheit, eins in der Zukunft)
    //    const pastTournament = {
    //        name: 'Vergangenes Turnier',
    //        date: new Date('2023-01-01').toISOString(),
    //        location: 'Berlin',
    //        duration: 1,
    //        description: 'Ein Turnier, das in der Vergangenheit liegt.',
    //    };
    //
    //    const futureTournament = {
    //        name: 'Zukünftiges Turnier',
    //        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 Tage
    //        location: 'München',
    //        duration: 2,
    //        description: 'Ein Turnier, das in der Zukunft liegt.',
    //    };
    //
    //    cy.request('POST', 'http://localhost:4000/tournaments', pastTournament).then(() => {
    //        cy.request('POST', 'http://localhost:4000/tournaments', futureTournament).then(() => {
    //            // GET-Anfrage für alle Turniere
    //            cy.request('GET', 'http://localhost:4000/tournaments').then((response) => {
    //                expect(response.status).to.eq(200);
    //
    //                // Durchlaufe alle Turniere und überprüfe, ob sie in der Zukunft liegen
    //                response.body.forEach((tournament) => {
    //                    const tournamentDate = new Date(tournament.date);
    //                    const currentDate = new Date();
    //
    //                    // Entferne die Uhrzeit, um nur das Datum zu vergleichen
    //                    tournamentDate.setHours(0, 0, 0, 0);
    //                    currentDate.setHours(0, 0, 0, 0);
    //
    //                    // Überprüfe, dass das Turnierdatum in der Zukunft liegt
    //                    expect(tournamentDate).to.be.greaterThan(currentDate);
    //                });
    //            });
    //        });
    //    });
    //});
});
