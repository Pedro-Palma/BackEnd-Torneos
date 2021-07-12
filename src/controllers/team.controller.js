'use strict'
const Team = require('../modules/team.module')
const League = require('../modules/league.module')
const pdf = require("html-pdf");

function addTeam(req, res) {
    let params = req.body
    let teamModel = new Team()
    if (params.name && params.idLeague) {
        teamModel.name = params.name;
        teamModel.idLeague = params.idLeague;
        teamModel.goalA = 0;
        teamModel.goalC = 0;
        teamModel.pj = 0;
        teamModel.pg = 0;
        teamModel.pe = 0;
        teamModel.pp = 0;
        teamModel.pts = 0;

        League.find({ _id: params.idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ menssage: "error en la petición buscar liga" })
            if (leagueFound.length <= 0) return res.status(500).send({ menssage: 'No existe esa liga' })
            Team.find({ idLeague: params.idLeague }).countDocuments((err, teamCount) => {
                if (err) return res.status(500).send({ menssage: "error al contar equipos de la liga" })
                if (teamCount >= 10) return res.status(500).send({ menssage: 'La liga tiene un maximo de 10 teams' })
                if (leagueFound[0]["owner"] != req.user.sub) return res.status(500).send({ menssage: 'No puede ingresar equipos a ligas que no creo' })
                Team.find({ name: params.name, idLeague: params.idLeague }).exec((err, teamFound) => {
                    if (err) return res.status(500).send({ menssage: "error en la petición buscar team" })
                    if (teamFound && teamFound.length > 0) return res.status(500).send({ menssage: 'ya existe un equipo en la liga con ese nombre' })

                    teamModel.save((err, teamSaved) => {
                        if (err) return res.status(500).send({ menssage: "error en la petición guardar team" })
                        return res.status(200).send({ teamSaved })

                    })


                })
            })
        })


    } else {
        return res.status(500).send({ menssage: 'ingres los parametros solicitados' })
    }

}
function addTeamUser(req, res) {
    let params = req.body
    var idLeague = req.params.idLeague;
    let teamModel = new Team()


    if (params.name && params.img) {
        teamModel.name = params.name;
        teamModel.idLeague = idLeague;
        teamModel.img = params.img;
        teamModel.goalA = 0;
        teamModel.goalC = 0;
        teamModel.pj = 0;
        teamModel.pg = 0;
        teamModel.pe = 0;
        teamModel.pp = 0;
        teamModel.pts = 0;

        League.find({ _id: idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ menssage: "error en la petición buscar liga" })
            if (leagueFound.length <= 0) return res.status(500).send({ menssage: 'No existe esa liga' })
            Team.find({ idLeague: idLeague }).countDocuments((err, teamCount) => {
                if (err) return res.status(500).send({ menssage: "error al contar equipos de la liga" })
                if (teamCount >= 10) return res.status(500).send({ menssage: 'La liga tiene un maximo de 10 teams' })
                if (leagueFound[0]["owner"] != req.user.sub) return res.status(500).send({ menssage: 'No puede ingresar equipos a ligas que no creo' })
                Team.find({ name: params.name, idLeague: idLeague }).exec((err, teamFound) => {
                    if (err) return res.status(500).send({ menssage: "error en la petición buscar team" })
                    if (teamFound && teamFound.length > 0) return res.status(500).send({ menssage: 'ya existe un equipo en la liga con ese nombre' })

                    teamModel.save((err, teamSaved) => {
                        if (err) return res.status(500).send({ menssage: "error en la petición guardar team" })
                        return res.status(200).send({ teamSaved })

                    })


                })
            })
        })


    } else {
        return res.status(500).send({ menssage: 'ingres los parametros solicitados' })
    }

}
function addTeamAdmin(req, res) {
    let params = req.body
    let idLeague = req.params.idLeague
    let teamModel = new Team()
    if (req.user.role == 0) {
        if (params.name) {
            teamModel.name = params.name;
            teamModel.img = params.img;
            teamModel.idLeague = idLeague;
            teamModel.goalA = 0;
            teamModel.goalC = 0;
            teamModel.pj = 0;
            teamModel.pg = 0;
            teamModel.pe = 0;
            teamModel.pp = 0;
            teamModel.pts = 0;

            League.find({ _id: idLeague }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ menssage: "error en la petición buscar liga" })
                if (leagueFound.length <= 0) return res.status(500).send({ menssage: 'No existe esa liga' })
                Team.find({ idLeague: idLeague }).countDocuments((err, teamCount) => {
                    if (err) return res.status(500).send({ menssage: "error al contar equipos de la liga" })
                    if (teamCount >= 10) return res.status(500).send({ menssage: 'La liga tiene un maximo de 10 teams' })
                    Team.find({ name: params.name, idLeague: idLeague }).exec((err, teamFound) => {
                        if (err) return res.status(500).send({ menssage: "error en la petición buscar team" })
                        if (teamFound && teamFound.length > 0) return res.status(500).send({ menssage: 'ya existe un equipo en la liga con ese nombre' })

                        teamModel.save((err, teamSaved) => {
                            if (err) return res.status(500).send({ menssage: "error en la petición guardar team" })
                            return res.status(200).send({ teamSaved })
                        })
                    })
                })
            })
        } else {
            return res.status(500).send({ menssage: 'ingrese los parámetros solicitados' })
        }
    } else {
        return res.status(500).send({ menssage: "no poseé permisos para realizar esta accion" })
    }
}
function listTeamUser(req, res) {
    let params = req.params;

    Team.find({ idLeague: params.idLeague }).exec((err, teamFound) => {
        if (err) return res.status(500).send({ menssage: "error en la petición buscar team" })
        if (teamFound.length <= 0) return res.status(500).send({ menssage: 'No existe un team con ese id' })

        League.find({ _id: teamFound[0]['idLeague'] }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ menssage: "error en la petición buscar liga del team" })
            if (leagueFound.length <= 0) return res.status(500).send({ menssage: 'El team no pertenece a ninguna liga' })
            if (leagueFound[0]['owner'] == req.user.sub) {
                return res.status(200).send({ teamFound })
            } else {
                return res.status(500).send({ menssage: 'no puede ver equipos que no pertenezca ninguna de sus ligas' })
            }
        })
    })


}
function listTeamAdmin(req, res) {
    let params = req.params;

    if (req.user.role == 0) {
        Team.find({ idLeague: params.idLeague }).exec((err, teamFound) => {
            if (err) return res.status(500).send({ menssage: 'Error en la peticion buscar team' })
            if (teamFound.length <= 0) return res.status(500).send({ menssage: 'No existen equipos con ese id' })
            return res.status(200).send({ teamFound })
        })
    } else {
        return res.status(500).send({ menssage: 'No posee permisos' })
    }
}
function deleteTeamUser(req, res) {
   
    let idTeam = req.params.idTeam;
    console.log(idTeam)
        Team.find({ _id: idTeam }).exec((err, teamFound) => {
            if (err) return res.status(500).send({ menssage: "error en la petición buscar team" })
            if (teamFound.length <= 0) return res.status(500).send({ menssage: 'No existe un team con ese id' })

            League.find({ _id: teamFound[0]['idLeague'] }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ menssage: "error en la petición buscar liga del team" })
                if (leagueFound.length <= 0) return res.status(500).send({ menssage: 'El team no pertenece a ninguna liga' })
                if (leagueFound[0]['owner'] == req.user.sub) {
                    Team.findByIdAndDelete(idTeam, (err, teamDeleted) => {
                        if (err) return res.status(500).send({ menssage: "Error en la peticion eliminar team" })
                        console.log(teamDeleted)
                        return res.status(200).send({ teamDeleted })
                    })
                } else {
                    return res.status(500).send({ menssage: 'no puede eliminar equipos que no pertenezca ninguna de sus ligas' })
                }
            })
        })
    

}
function deleteTeamAdmin(req, res) {
    let params = req.params;
    if (params.idTeam) {
        if (req.user.role == 0) {
            Team.find({ _id: params.idTeam }).exec((err, teamFound) => {
                if (err) return res.status(500).send({ menssage: 'Error en la peticion buscar team' })
                if (teamFound.length <= 0) return res.status(500).send({ menssage: 'No existen equipos con ese id' })
                Team.findByIdAndDelete(params.idTeam, (err, teamDeleted) => {
                    if (err) return res.status(500).send({ menssage: 'Error en la peticion eliminar team' })
                    return res.status(200).send({ teamDeleted })
                })
            })
        } else {
            return res.status(500).send({ menssage: 'No posee permisos' })
        }

    } else {
        return res.status(500).send({ menssage: 'Ingrese los parametros solicitados' })
    }
}

function updateTeamUser(req, res) {
    let params = req.body;
    let idTeam = req.params.idTeam
    
        Team.find({ _id: idTeam }).exec((err, teamFound) => {
            if (err) return res.status(500).send({ menssage: "error en la petición buscar team" })
            if (teamFound.length <= 0) return res.status(500).send({ menssage: 'No existe un team con ese id' })

            League.find({ _id: teamFound[0]['idLeague'] }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ menssage: "error en la petición buscar liga del team" })
                if (leagueFound.length <= 0) return res.status(500).send({ menssage: 'El team no pertenece a ninguna liga' })
                if (leagueFound[0]['owner'] == req.user.sub) {
                    Team.findByIdAndUpdate(idTeam, params, { new: true }, (err, teamUpdated) => {
                        if (err) return res.status(500).send({ menssage: "error en la petición editar  team" })
                        return res.status(200).send({ teamUpdated })

                    })
                } else {
                    return res.status(500).send({ menssage: 'no puede editar equipos que no pertenezca ninguna de sus ligas' })
                }
            })
        })
    


}

function updateTeamAdmin(req, res) {
    let params = req.body;
    let idTeam = req.params.idTeam;
    if (idTeam) {
        if (req.user.role == 0) {
            Team.find({ _id: idTeam }).exec((err, teamFound) => {
                if (err) return res.status(500).send({ menssage: 'Error en la peticion buscar team' })
                if (teamFound.length <= 0) return res.status(500).send({ menssage: 'No existen equipos con ese id' })

                Team.findByIdAndUpdate(idTeam, params, { new: true }, (err, teamUpdated) => {
                    if (err) return res.status(500).send({ menssage: "error en la petición editar  team" })
                    return res.status(200).send({ teamUpdated })
                })
            })
        } else {
            return res.status(500).send({ menssage: 'No posee permisos' })
        }

    } else {
        return res.status(500).send({ menssage: 'Ingrese los parametros solicitados' })
    }
}

function findTeamId(req, res) {
    var idTeam = req.params.idTeam;
    Team.findOne({ _id: idTeam }, (err, teamFind) => {
        if (err) return res.status(500).send({ menssaje: 'Error al solicitar equipo' })
        if (teamFind) {
            return res.status(200).send({ teamFind })
        } else {
            return res.status(500).send({ menssaje: 'No se encontraron registros para mostrar' })
        }
    })
}


function pdfTeamsByLeague(req, res) {
    var liga = req.params.idLeague;
    var x = 0;
    var row = [];
    var content = '';
    var header = `
          <style>
              *{
                  font-family: sans-serif;
                  padding: 30px;
              }
              h1{
                  text-align: center;
                  border-bottom: 1px solid #A4A4A4;
                  margin-top: 0px;
                  padding-top: 0px;
              }
              table {
                  border-collapse: collapse;
                  background-color: white;
                  width: 100%;
              }
              td, th{
                  padding: 12px;
              }
              th{
                  background-color: #5e5959;
                  border-bottom: solid 5px #383838;
                  color: white;
                  text-align: justify;
              }
              tr:nth-child(even){
                  background-color: #ddd;
              }
          </style>
      </head>
      <body>
          <h1>PDF Generado por liga</h1>
          <table>
          <tr>
              
              <th>Puntos</th>
              <th>Victorias</th>
              <th>Empates</th>
              <th>Derrotas</th>
              <th>Goles a Favor</th>
              <th>Goles en contra</th>
              <th>Diferencia de goles</th>
          </tr>
      
      `;

    Team.find({ idLeague: liga }).sort({ pts: -1, goalA: -1 }).exec((err, teamsFound) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
        if (!teamsFound) return res.status(500).send({ mensaje: 'No se encontro ningun registro en usuarios' })

        while (x < teamsFound.length) {
            row[x] = `
        <tr>
            
            <td>${teamsFound[x].pts}</td>
            <td>${teamsFound[x].pj}</td>
            <td>${teamsFound[x].pg}</td>
            <td>${teamsFound[x].pe}</td>
            <td>${teamsFound[x].pp}</td>
            <td>${teamsFound[x].goalA}</td>
            <td>${teamsFound[x].goalC}</td>
            <td>${teamsFound[x].goalA - teamsFound[x].goalC }</td>
        </tr>
        `;
            content += row[x]
            x++;
        }
        content = header + content + '</table></body>'

        League.findOne({ _id: liga }, (err, leagueFound) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })

            pdf.create(content).toFile(`./${leagueFound.name}.pdf`, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            })

        })

        return res.status(200).send({ mensaje: 'Pdf creado con exito!' })

    })
}


module.exports = {
    addTeam,
    addTeamAdmin,
    listTeamUser,
    listTeamAdmin,
    deleteTeamUser,
    deleteTeamAdmin,
    updateTeamUser,
    updateTeamAdmin,
    findTeamId,
    addTeamUser,
    pdfTeamsByLeague
}