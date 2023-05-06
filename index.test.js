const app = require('../src/app');
const session = require('supertest');
const request = session(app);

const character = {
    id: 1000,
    name: 'unknown',
    species: 'unknown',
    gender: 'unknown',
    status: 'unknown',
    origin: {
        name: 'unknown'
    },
    image: 'unknown'
}

describe('ROUTING test', () => {

    describe('GET /rickandmorty/character/:id', () => {

        it('If the request succeeded, status: 200 is expected', async () => {
            const response = await request.get('/rickandmorty/character/1');
            expect(response.statusCode).toBe(200);
        });

        it('Returns an object with the properties: "id", "name", "species", "gender", "status", "origin" and "image"', async () => {
            const response = await request.get('/rickandmorty/character/1');
            for(const prop in character){
                expect(response.body).toHaveProperty(prop);
            }
        });

        it('If there is an error, respond with status: 500', async () => {
            const response = await request.get('/rickandmorty/character/333ss3');
            expect(response.statusCode).toBe(500);
        });
    });

    describe('GET /rickandmorty/login', () => {

        const access = { access: true };

        it('Returns an object with the property "access: true" when login info is correct', async () => {
            const response = await request.get('/rickandmorty/login?email=email@domain.com&password=123456');
            expect(response.body).toEqual(access);
        });

        
        it('Returns an object with the property "access: false" when login info is invalid', async () => {
            const response = await request.get('/rickandmorty/login?email=em@domain.com&password=123');
            access.access = false;
            expect(response.body).toEqual(access);
        });
    });

    describe('POST /rickandmorty/fav', () => {

        it('Must save character in "Favorites"', async () => {

            const response = await request.post('/rickandmorty/fav').send(character);
            expect(response.body).toContainEqual(character);

        });

        it('Must save a new character in "Favorites" without overwriting the existing ones', async () => {

            character.id = 2000;
            character.name = 'unknown 2';
            const response = await request.post('/rickandmorty/fav').send(character);
            expect(response.body.length).toBe(2);

        });
    });

    describe('DELETE /rickandmorty/fav/:id', () => {

        it('When a non existent character is sent, must return an unmodified array of "Favorites"', async () => {
            const response = await request.delete('/rickandmorty/fav/2gh');
            expect(response.body.length).toBe(2);
        });

        it('When send the right ID, must delete that character', async () => {
            const response = await request.delete('/rickandmorty/fav/1000');
            expect(response.body.length).toBe(1);
        });
    });
});
