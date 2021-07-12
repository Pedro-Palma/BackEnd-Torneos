'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    league:{
        type: Schema.Types.ObjectId,ref:"leagues"
    },
    team1:String,
    team2:String,
    goal1: Number,
    goal2: Number
})

module.exports = mongoose.model('matches',matchSchema)