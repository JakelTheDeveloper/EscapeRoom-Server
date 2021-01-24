const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeScoresArray } = require('./scores.fixtures')

describe('Scores Endpoints', function () {
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    before('clean the table', () => db('highscore_data').truncate())

    afterEach('cleanup', () => db('highscore_data').truncate())

    after('disconnect from db', () => db.destroy())

    describe('GET /api/scores', () => {
        context(`Given no scores`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/scores')
                    .expect(200, [])
            })
        })
    })
    describe('GET /api/scores', () => {
        context('Given there are scores in the database', () => {
            let testScores = makeScoresArray()
            beforeEach('insert scores', () => {
                return db
                    .into('highscore_data')
                    .insert(testScores)
            })
            it('GET /scores responds with 200 and all of the scores', () => {
                return supertest(app)
                    .get('/api/scores')
                    .expect(200, testScores)
            })
        })
    })
    describe(`POST /api/scores`, () => {
        it(`creates a score, responding with 201 and the new score`, function () {
            const newScore = {
                username: 'JuiceBar',
                hours: 0,
                minutes: 3,
                seconds: 12
            }
            return supertest(app)
                .post('/api/scores')
                .send(newScore)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(newScore.username)
                    expect(res.body.hours).to.eql(newScore.hours)
                    expect(res.body.minutes).to.eql(newScore.minutes)
                    expect(res.body.seconds).to.eql(newScore.seconds)
                    expect(res.body).to.have.property('id')
                })
        })
        it(`responds with 400 and an error message when the 'username' is missing`, () => {
            return supertest(app)
                .post('/api/scores')
                .send({
                    hours: 0,
                    minutes: 2,
                    seconds: 12
                })
                .expect(400, {
                    error: { message: `Name required` }
                })
        })
    })
})