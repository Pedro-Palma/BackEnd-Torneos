'use strict'
const User = require('../modules/user.module')
const League = require('../modules/league.module')
const Team = require('../modules/team.module')
const Match = require('../modules/match.module')

function deleteLeagueAdmin(req, res) {
    let params = req.params
    if (req.user.role == 0) {
        if (params.idLeague) {
            League.find({ _id: params.idLeague }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ message: "error en la petición buscar liga " })
                if (leagueFound.length <= 0) return res.status(500).send({ message: 'El id no pertenece a ninguna liga' })
                League.findByIdAndDelete(params.idLeague, (err, leagueDeleted) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion eliminar liga" })
                    if (leagueDeleted) {
                        Team.deleteMany({ idLeague: params.idLeague }, (err, teamDeleted) => {
                            if (err) return console.log("error en la peticion")
                            return res.status(200).send({ leagueDeleted })
                        })


                    }

                })




            })




        } else {
            return res.status(500).send({ mensaje: 'ingrese los parametros solicitados' })
        }
    } else {
        return res.status(500).send({ mensaje: 'no posee permisos' })
    }
}
function deleteLeagueUser(req, res) {
    let params = req.params;
    if (params.idLeague) {
        League.find({ _id: params.idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: "error en la petición buscar liga " })
            if (leagueFound.length <= 0) return res.status(500).send({ message: 'El id no pertenece a ninguna liga' })
            if (leagueFound[0]['owner'] == req.user.sub) {
                League.findByIdAndDelete(params.idLeague, (err, leagueDeleted) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion eliminar liga" })
                    if (leagueDeleted) {
                        Team.deleteMany({ idLeague: params.idLeague }, (err, teamDeleted) => {
                            if (err) return console.log("error en la peticion")
                            Match.deleteMany({ league: params.idLeague }, (err, matchDeleted) => {
                                if (err) return console.log("error en la peticion")
                                return res.status(200).send({ leagueDeleted })

                            })

                        })


                    }

                })

            } else {
                return res.status(500).send({ mensaje: 'No puede eliminar ligas que no creo' })

            }

        })
    } else {
        return res.status(500).send({ mensaje: 'Ingrese los parametros solicitados' })
    }
}
function addLeagueUser(req, res) {
    let params = req.body;
    let leagueModel = new League();
    params.owner = req.user.sub;
    if (params.owner && params.name) {
        leagueModel.owner = req.user.sub;
        leagueModel.name = params.name;
        leagueModel.country = params.country;

        League.find({ name: params.name,owner: req.user.sub }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: 'Error al buscar liga' })
            if (leagueFound.length > 0) return res.status(500).send({ menssage: "Ya posee una liga con ese nombre" })

            leagueModel.save((err, leagueSaved) => {
                if (err) return res.status(500).send({ menssage: "error en la petición guardar liga" })
                if (leagueSaved) {
                    return res.status(200).send({ leagueSaved })
                } else {
                    return res.status(500).send({ menssage: "error al guardar liga" })
                }
            })
        })
    } else {
        return res.status(500).send({ menssage: 'Ingrese los parametros solicitados'})
    }
}
function addLeagueAdmin(req, res) {
    
    let params = req.body;
    let leagueModel = new League();
    if(params.owner && params.name){

       User.findOne({user: params.owner}).exec((err,userFound)=>{
        if(err) return res.status(500).send({ menssage:'Error al buscar usuario'})
        if(!userFound) return res.status(500).send({ menssage:"el nombre de usuario no existe"})

        League.find({owner: userFound['_id'], name: params.name}).exec((err, leagueFound) => {



            if(err) return res.status(500).send({ menssage:'Error al buscar liga'})
            if(leagueFound.length > 0) return res.status(500).send({ menssage:"el usuario ya  posee una liga con ese nombre"})
            leagueModel.owner = userFound['_id'];
            leagueModel.name = params.name;
            leagueModel.country = params.country;
        leagueModel.save((err,leagueSaved)=>{
            if (err) return res.status(500).send({ menssage: "error en la petición guardar liga" })
            return res.status(200).send({ leagueSaved })




        })
    })
        })
    
    } else{
        return res.status(500).send({menssage:'Ingrese los parametros solicitados'})
    }
}
function updateLeagueAdmin(req, res) {
    var idLeague = req.params.idLeague;
    var params = req.body;

    League.findByIdAndUpdate(idLeague, params, { new: true }, (err, leagueUpdated) => {
        if (err) return res.status(500).send({ message: "error en la petición actualizar liga " })
        return res.status(200).send({ leagueUpdated })

    })
}
function updateLeagueUser(req, res) {
    var idLeague = req.params.idLeague;
    var params = req.body;

    League.findByIdAndUpdate(idLeague, params, { new: true }, (err, leagueUpdated) => {
        if (err) return res.status(500).send({ message: "error en la petición actualizar liga " })
        return res.status(200).send({ leagueUpdated })

    })
}
function listLeagueUser(req, res) {
    var idUser = req.params.idUser;

    League.find({ owner: idUser }).exec((err, leagueFound) => {
        if (err) return res.status(500).send({ message: 'Error en la petición buscar ligas' })
        if (leagueFound.length > 0) {
            return res.status(200).send({ leagueFound })
        } else {
            return res.status(500).send({ mensaje: 'No posee ligas' })
        }
    })


}
function listLeagueAdmin(req, res) {
    if (req.user.role == 0) {
        League.find().populate('owner','user').exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: "error en la peticion de buscar ligas" })
            if (leagueFound.length <= 0) return res.status(500).send({ message: 'No existen ligas' })
            return res.status(200).send({ leagueFound })
        })
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos' })
    }
}
function findLeagueId(req, res) {
    var idLeague = req.params.idLeague;

    League.findOne({ _id: idLeague }, (err, leagueFound) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar liga' })
        if (leagueFound) {
            return res.status(200).send({ leagueFound })
        } else {
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}


module.exports = {
    deleteLeagueAdmin,
    deleteLeagueUser,
    addLeagueUser,
    addLeagueAdmin,
    updateLeagueAdmin,
    updateLeagueUser,
    listLeagueUser,
    listLeagueAdmin,
    findLeagueId
}