import pool from "../database.js";
import errors from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";

export const sendMessage = async (req, res) => {
     try {
          /* const { userid, message_body, room } = req.body;
          const newMessage = {
               userid,
               message_body,
               room
          }
          let currentTime = Math.floor(new Date().getTime() / 1000);

          if (req.session.sendTime > currentTime) {
               req.session.sendTime = 0
               return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.response(HTTP_STATUS.BAD_REQUEST, "Estas enviando mensajes demasiado rapido."));

          } else {

               let unixTimestamp = Math.floor(Date.now() / 1000);

               await pool.query(`INSERT INTO chat_room (userid, message_body, room, created_at)
                                   VALUES (?, ?, ?,?)`, [newMessage.userid, newMessage.message_body, newMessage.room, unixTimestamp])

               req.session.sendTime = Math.floor(new Date().getTime() / 1000) + 2


          } */
          return res.status(HTTP_STATUS.SUCCESSFUL).json(errors.success(HTTP_STATUS.SUCCESSFUL, "You have send a message."));

     } catch (err) {
          console.log(err);
          return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.response(HTTP_STATUS.BAD_REQUEST, "Hubo un error al enviar el mensaje, comunicate con un administrador."))
     }

}

export const deleteMessageAsAdmin = async (req, res) => {

     try {
          const { chatid } = req.params;

          //Verificar si el usuario actual es administrador a través de la sesión
          const isAdmin = req.session.userid
          console.log(isAdmin);
          let verifyAdmin = await pool.query(`SELECT 
                                                       users_permisions.Rol
                                                       FROM 
                                                            users_general
                                                       INNER JOIN
                                                            users_permisions
                                                       ON
                                                            users_general.UserID = users_permisions.PermisionsID
                                                       WHERE 
                                                            users_general.UserID = ?`, [isAdmin])

          if (verifyAdmin[0].Rol != 2) return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.response(HTTP_STATUS.BAD_REQUEST, "No eres admin para hacer esto."));

          //Borrar el mensaje
          let deleteMessage = await pool.query(`DELETE FROM 
                                                                 4saken.chat_room
                                                       WHERE 
                                                            chatid = ?`, [chatid]);

          if (deleteMessage.affectedRows != 1) return res.status(HTTP_STATUS.NOT_ACCEPTABLE).json(errors.response(HTTP_STATUS.NOT_ACCEPTABLE, "No se ha podido borrar el mensaje."));

          return res.json(errors.success(HTTP_STATUS.SUCCESSFUL, "You have delete a message."));
     } catch (err) {
          console.log(err);
          return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.success(HTTP_STATUS.NOT_ACCEPTABLE, "Error en borrar mensaje como admin, comunicate con el desarrollador."));
     }
}

export const getMessages = async (req, res) => {
     try {
          const { room } = req.params

          const getMessages = await pool.query(`SELECT chat_room.chatid,
                                                            chat_room.message_body,
                                                            chat_room.room,
                                                            chat_room.created_at,
                                                            users_web.avatarfull,
                                                            users_web.personaname,
                                                            users_web.profileurl,
                                                            users_web.colorChat,
                                                            users_web.glowColor,
                                                            users_permisions.Rol,
                                                            users_permisions.IsPremium,
                                                            users_mmr.Rating,
                                                            users_mmr.GamesPlayed,
                                                            users_mmr.LastGame,
                                                            users_mmr.Wins,
                                                            duel_mmr.Rating,
                                                            duel_mmr.GamesPlayed,
                                                            duel_mmr.LastGame,
                                                            duel_mmr.Wins
                                                       FROM users_general
                                                       INNER JOIN chat_room
                                                            ON users_general.UserID = chat_room.userid
                                                       INNER JOIN users_web
                                                            ON users_general.UserID = users_web.WebID
                                                       INNER JOIN users_mmr
                                                            ON users_general.UserID = users_mmr.Pug_MMRID
                                                       INNER JOIN duel_mmr
                                                            ON users_general.UserID = duel_mmr.Duel_MMRID
                                                       INNER JOIN users_permisions
                                                            ON users_general.UserID = users_permisions.PermisionsID
                                                       WHERE room = ?
                                                       ORDER BY chatid DESC`, [room])

          return res.json(getMessages.reverse());

     } catch (err) {
          console.log(err);
          return res.status(HTTP_STATUS.BAD_REQUEST).json(errors.response(HTTP_STATUS.FORBIDDEN, "Error al listar los mensajes, comunicate con el administrador"))
     }
}