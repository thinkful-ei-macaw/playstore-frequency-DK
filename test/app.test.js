const app = require('../app');
const supertest = require('supertest')
const { expect } = require('chai')

describe.only('GET /apps endpoint', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1)
        const games = res.body[0];
        expect(games).to.include.all.keys(
          'App', 'Category', 'Genres', 'Rating'
        )
      })
  }) 
  it('should return 400 if `genre` query is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'invalid'})
      .expect(400, 'Parameter `genres` must be valid')
  })
  it('should return array of apps filtered by genre', () => {
    return supertest(app)
      .get('/apps')
      .query({genres: 'Action'})
      .expect(200)
      .then(res => {
        const expectedBody = res.body.filter(app => app.Genres.includes('Action'))
        expect(res.body).to.eql(expectedBody)
      })
  })
  it('should return 400 if `sort` query is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'invalid'})
      .expect(400, 'Sort must be either Rating or App')
  })
  it('should return array of apps sorted by rating or app', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        let sorted = true;
        let i = 0;
        while (i<res.body.length - 1) {
          const gameAtI = res.body[i]
          const gameAtIPlus1 = res.body[i + 1]

          if (gameAtIPlus1.rating < gameAtI.rating) {
            sorted = false;
            break;
          }
          i++
        }
        expect(sorted).to.be.true;
      });
  });
 
  
});

describe('GET /frequency endpoint', () => {
  it('should return 400 if no query provided', () => {
    return supertest(app)
      .get('/frequency')
      .expect(400, 'Invalid request')
  })
  it('should return 400 if query is not a string', () => {
    return supertest(app)
      .get('/frequency')
      .query({s: {key: 'value'}})
      .expect(400, 'Please submit a string')
  })
  it('should return 200 and json object counts if query exists', () => {
    return supertest(app)
      .get('/frequency')
      .query({s: 'some string i made'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('object')
        expect(res.body).to.include.all.keys(
          'unique', 'average', 'highest'
        )
      })
  })
});