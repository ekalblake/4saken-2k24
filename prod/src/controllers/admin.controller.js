import pool from "../database.js";
import errors from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";
import Gamedig from 'gamedig'

export const getServerListAdmin = async (req, res) => {
     try {
          const getServers = await pool.query(`SELECT *
                                             FROM 4saken.l4d2_servers
                                             WHERE status = 1
                                             ORDER BY serverid ASC`)

          res.json(getServers);
     } catch (err) {
          console.log(err);
          res.json(errors.response(HTTP_STATUS.BAD_REQUEST, "Hubo un error al listar los servidores."))
     }
}
export const getServerListPublic = async (req, res) => {
     try {

          const getServers = await pool.query(`SELECT *
                                             FROM 4saken.l4d2_servers
                                             WHERE status = 1
                                             ORDER BY serverid ASC`)

          const servers = getServers.map(server => {
               return {
                    'ip': server.ip,
                    'port': server.port
               }
          })

          var checkServer = [];

          for (let server of servers) {
               try {
                    const data = await Gamedig.query({
                         type: 'left4dead2',
                         host: server.ip,
                         port: server.port
                    })

                    const nombreJugador = data.players.map(l => {
                         return l.name
                    })
                    checkServer.push({ 'name': data.name, 'map': data.map, 'numplayers': data.raw.numplayers, 'players': nombreJugador, 'maxplayers': data.maxplayers, 'ip': data.connect, 'ping': data.ping })

               } catch {
                    console.log("No se ha podido conectar al servidor: " + server.ip + ':' + server.port)
               }
          }

          return res.json(checkServer);
     } catch (err) {
          console.log(err);
          return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.response(HTTP_STATUS.BAD_REQUEST, "Hubo un error al listar los servidores."))
     }
}


export const deleteServer = async (req, res) => {
     try {
          const { serverid } = req.params;

          pool.query('DELETE FROM 4saken.l4d2_servers WHERE serverid = ?', [serverid])

          return res.status(HTTP_STATUS.SUCCESSFUL).json(errors.success(HTTP_STATUS.SUCCESSFUL, "You have deleted a server."));

     } catch (err) {
          console.log(err);
          return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.response(HTTP_STATUS.BAD_REQUEST, "Hubo un error al actualizar los servidores."));
     }

}

export const addServer = async (req, res) => {
     try {
          const { ip, descripcion, port } = req.body;

          const addServer = {
               ip,
               descripcion,
               port
          }
          pool.query(`INSERT INTO 4saken.l4d2_servers
                              (ip, extra, port)
                         VALUES (?, ?, ?)`, [addServer.ip, addServer.descripcion, addServer.port])

          return res.json(errors.success(HTTP_STATUS.SUCCESSFUL, "Has insertado un nuevo servidor.."));

     } catch (err) {
          console.log(err)
          return res.json(errors.response(HTTP_STATUS.BAD_REQUEST, "Error desconocido, contáctate con el administrador."));
     }

}

export const addMap = async (req, res) => {

     try {
          const getMaps = await pool.query(`SELECT * FROM l4d2_maps WHERE status = 1`)
          res.json(getMaps);
     } catch (err) {
          res.json(errors.response(HTTP_STATUS.BAD_REQUEST, err))
     }
}