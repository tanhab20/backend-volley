import {ITournament} from "../../interface/ITournament";

describe('Tournament API Tests', () => {

    it('should fetch all tournaments', () => {
        cy.request('GET', 'https://kavolley.uber.space/api/tournaments')
            .its('status')
            .should('equal', 200);
    });

    /*
    it('should return 500 for missing required fields', () => {
        const incompleteTournament = {
            date: new Date().toISOString(),
            location: 'Hamburg',
            duration: 2,
            description: 'Ein aufregendes Turnier.',
        };

        cy.request({
            method: 'POST',
            url: 'https://kavolley.uber.space/api/tournaments',
            body: incompleteTournament,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body).to.have.property('error', 'Fehler beim Erstellen des Turniers');
        });
    });
    */

    it('should fetch a specific tournament by ID', () => {
        const tournamentToFetch = {
            name: 'Hallenmeisterschaft',
            date: new Date().toISOString(),
            location: 'Köln, Dom',
            duration: "2 days",
            description: 'Ein Hallenturnier mit Teams aus ganz Deutschland.',
        };

        cy.request('POST', 'https://kavolley.uber.space/api/tournaments', tournamentToFetch).then((postResponse) => {
            const { _id } = postResponse.body;

            expect(_id).to.match(/^[a-f\d]{24}$/i);

            cy.request('GET', `https://kavolley.uber.space/api/tournaments/${_id}`).then((getResponse) => {
                expect(getResponse.status).to.eq(200);

                expect(getResponse.body).to.have.property('_id', _id);
                expect(getResponse.body).to.have.property('name', tournamentToFetch.name);
            });
        });
    });

    it('should delete a tournament successfully', () => {
        const newTournament = {
            name: 'Turnier zum Löschen',
            date: new Date().toISOString(),
            location: 'Berlin, Halle',
            duration: "2 days",
            description: 'Dies ist ein Test-Turnier, das gelöscht wird.',
        };

        cy.request('POST', 'https://kavolley.uber.space/api/tournaments', newTournament).then((postResponse) => {
            const { _id } = postResponse.body;

            cy.request('DELETE', `https://kavolley.uber.space/api/tournaments/${_id}`)
                .its('status')
                .should('equal', 200);
        });
    });


    it('should return 404 for a non-existent tournament ID', () => {
        const nonExistentID = '64c3f8e7b4569e001e62e6aa';

        cy.request({
            method: 'GET',
            url: `https://kavolley.uber.space/api/tournaments/${nonExistentID}`,
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
            location: 'München, Olympiapark',
            duration: "3 days",
            description: 'Ein spannendes Turnier für Sommerliebhaber.',
        };

        cy.request('POST', 'https://kavolley.uber.space/api/tournaments', newTournament).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', newTournament.name);
            expect(response.body).to.have.property('description', newTournament.description);
        });
    });

    it('should return correct response structure when creating a tournament', () => {
        const newTournament = {
            name: 'Frühjahrsmeisterschaft',
            date: new Date().toISOString(),
            location: 'Frankfurt, Hauptbahnhof',
            duration: "4 days",
            description: 'Ein aufregendes Turnier im Frühling.'
        };

        cy.request('POST', 'https://kavolley.uber.space/api/tournaments', newTournament).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', newTournament.name);
            expect(response.body).to.have.property('date');
            expect(response.body).to.have.property('location', newTournament.location);
            expect(response.body).to.have.property('duration').and.equal(`${newTournament.duration}`); // Erwartung als String
            expect(response.body).to.have.property('description', newTournament.description);
        });
    });

    it('should filter tournaments by location (Berlin, Hamburg)', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { locations: 'Berlin,Hamburg' }
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Überprüfen, dass die Location der Turniere Berlin oder Hamburg enthält
            response.body.forEach((tournament: ITournament) => {
                const city = tournament.location.split(',')[0].trim();  // Nur die Stadtname prüfen
                expect(['Berlin', 'Hamburg']).to.include(city);
            });
        });
    });

    it('should filter tournaments by duration (3 days, 1 day)', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { durations: '3 days,1 day' }
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Überprüfen, dass die Dauer der Turniere entweder 3 Tage oder 1 Tag ist
            response.body.forEach((tournament: ITournament) => {
                expect(['3 days', '1 day']).to.include(tournament.duration);
            });
        });
    });

    it('should filter tournaments by search term in name', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { search: 'Schach' }
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Überprüfen, dass der Name des Turniers den Suchbegriff 'Schach' enthält
            response.body.forEach((tournament: ITournament) => {
                expect(tournament.name.toLowerCase()).to.include('schach');
            });
        });
    });

    it('should filter tournaments by location and duration', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { locations: 'Berlin', durations: '3 days' }
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Überprüfen, dass alle Turniere in Berlin sind und eine Dauer von 3 Tagen haben
            response.body.forEach((tournament: ITournament) => {
                expect(tournament.location).to.include('Berlin');
                expect(tournament.duration).to.eq('3 days');
            });
        });
    });

    //------------------------------------------------------------------


    it('should return only tournaments that match all filters (location, duration, search)', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { locations: 'Berlin', durations: '3 days', search: 'Beach' }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.not.empty;

            response.body.forEach((tournament: ITournament) => {
                expect(tournament.location).to.include('Berlin');
                expect(tournament.duration).to.eq('3 days');
                expect(tournament.name.toLowerCase()).to.include('beach');
            });
        });
    });

    it('should handle invalid location gracefully', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { locations: 'InvalidCity' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
    });

    it('should handle invalid duration gracefully', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { durations: '100 days' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
    });

    it('should return an empty array if no tournament matches the search', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { search: 'xyz123doesnotexist' }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
    });

    it('should return case-insensitive search results', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { search: 'beAch' } // Mischmasch von Groß-/Kleinschreibung
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.not.empty;

            response.body.forEach((tournament: ITournament) => {
                expect(tournament.name.toLowerCase()).to.include('beach');
            });
        });
    });

    it('should return results when search contains extra spaces', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { search: '  Beach   Volleyball  ' }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.not.empty;

            response.body.forEach((tournament: ITournament) => {
                expect(tournament.name.toLowerCase()).to.include('beach volleyball');
            });
        });
    });

    it('should verify response structure', () => {
        cy.request({
            method: 'GET',
            url: 'https://kavolley.uber.space/api/tournaments',
            qs: { locations: 'Berlin' }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.not.empty;

            response.body.forEach((tournament: ITournament) => {
                expect(tournament).to.have.all.keys('id', 'name', 'location', 'duration', 'date', 'participants');
                expect(tournament.id).to.be.a('number');
                expect(tournament.name).to.be.a('string');
                expect(tournament.location).to.be.a('string');
                expect(tournament.duration).to.be.a('string');
                expect(tournament.date).to.be.a('string'); // Falls Datum im ISO-Format zurückkommt
                expect(tournament.participants).to.be.an('array');
            });
        });
    });


});
