const supertest = require('supertest')
const app = require('../src/app')
const { expect } = require('chai')
const knex = require('knex')
require('dotenv').config()
const { makeScoresArray } = require('./scores.fixtures')

describe.only(`Scores Router Endpoint`, () => {
    let db
    let testScores = makeScoresArray()
  
    before(`Make a connection`, () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    before(() => db('highscore_data').truncate())
    afterEach(() => db('highscore_data').truncate())
    after(() => db.destroy())

    describe('scoresRouter', () => {
        before(() => {
            return db
                .into('highscore_data')
                .insert(testScores)
        })
      it('GET / responds with 200 containing Data', () => {
        return supertest(app)
          .get('/api/scores')
          .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body).to.have.lengthOf.at.least(1)
            expect(res.body[0]).to.have.all.keys('id', 'username', 'hours', 'minutes', 'seconds')
            expect(res.body[0].id).to.be.an('number')
            expect(res.body[0].username).to.be.an('string')
            expect(res.body[0].hours).to.be.an('number')
            expect(res.body[0].minutes).to.be.an('number')
            expect(res.body[0].seconds).to.be.an('number')
          })
      })
    })
  })