const scoresService = {
    getAllScores(knex){
       return knex.select('*').from('highscore_data')
    },
    insertScore(knex,newScore){
        return knex
        .insert(newScore)
        .into('highscore_data')
        .returning('*')
        .then(rows=>{
            return rows[0]
        })
    }
}

module.exports = scoresService