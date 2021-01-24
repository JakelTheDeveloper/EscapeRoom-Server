const scoresService = require('../src/scores/scores-service')
const knex = require('knex')
const app = require('../src/app')
const { expect } = require('chai')

describe(`Highscore service object`, function () {
    let db
    let testScores = [
        {
            id: 1,
            username: 'foo',
            hours: 0,
            minutes: 3,
            seconds: 12,
        },
        {
            id: 2,
            username: 'bar',
            hours: 0,
            minutes: 5,
            seconds: 24,
        },
        {
            id: 3,
            username: 'joe',
            hours: 0,
            minutes: 7,
            seconds: 36,
        }
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    before(() => db('highscore_data').truncate())
    afterEach(() => db('highscore_data').truncate())
    after(() => db.destroy())

    context('Given highscore_data has data', () => {
        before(() => {
            return db
                .into('highscore_data')
                .insert(testScores)
        })
        it(`getAllScores() resolves all scores from 'Highscore_data' table`, () => {
            return scoresService.getAllScores(db)
                .then(scores => {
                    expect(scores).to.eql(testScores)
                })
        })
    })
    context(`Given 'highscore_data' has no data`, () => {
        it(`getAllScores() resolves an empty array`, () => {
            return scoresService.getAllScores(db)
                .then(scores => {
                    expect(scores).to.eql([])
                })
        })
        it(`insertScore() inserts a new score and resolves new score and an 'id'`, () => {
            let newScore = {
                username: "Foomar",
                hours: 0,
                minutes: 2,
                seconds: 25
            }
            return scoresService.insertScore(db, newScore)
                .then(score => {
                    expect(score).to.eql({
                        id: 1,
                        username: newScore.username,
                        hours: newScore.hours,
                        minutes: newScore.minutes,
                        seconds: newScore.seconds
                    })
                })
        })
    })
})
