const express = require('express')
const scoresService = require('./scores-service')
const scoresRouter = express.Router()
const path = require('path')
const bodyParser = express.json()
const logger = require('../logger')

scoresRouter
    .route('/')
    .get((req, res, next) => {
        scoresService.getAllScores(
            req.app.get('db')
        )
            .then(scores => {
                res.json(scores)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { username, hours, minutes, seconds } = req.body;
        if (!username) {
            logger.error('Name Required')
            return res
                .status(400)
                .json({error:{message:'Name required'}});
        }
        const newScore = { username, hours, minutes, seconds }
        scoresService.insertScore(
            req.app.get('db'),
            newScore
        )
            .then(score => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${score.id}`))
                    .json(score)
                    console.log(req.originalUrl)
            })
            .catch(next)
    })
module.exports = scoresRouter