'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leagueSchema = Schema({
    name: String,
    owner: {type: Schema.Types.ObjectId,ref:"users"},
    country: String
})

module.exports = mongoose.model('leagues', leagueSchema)