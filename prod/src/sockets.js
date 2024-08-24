import pool from "./database.js";
import helpers, {getRandomIP} from './utils/helpers.js'
import _ from "lodash";
import {  queryPlayersVerify, 
          queryPlayersVerifyCounter, 
          queryVerifyUnreadyPlayers, 
          queryDropPlayerQueue, 
          queryUpdatePlayerStatus, 
          queryUpdatePlayer } 
from "./querys/users.querys.js"; 

export default (io) => {
     //SOCKET IO
     let connectedSockets = [];
     const messageCounts = {};

     io.on('connection', async (socket) => {
          
          //Verifica las conexiones de socket IO
          if(connectedSockets.indexOf(socket) !== -1) {
               console.log('Socket already connected');
               return;
          }
               
          connectedSockets.push(socket);
           
          const userInfo = socket.handshake.auth.userInfo
                    

          //Se ejecuta al logearse
          socket.on('join:room', (room) => {
               socket.join(room);
               console.log("ESTOY EN ROOM: " + room)
               //io.to(room).emit('login:user', userInfo);
               io.emit('login:user', userInfo);
          });

          console.log(`User ${socket.id} connected.`)

          /************************************************************************************************************
           * Queue Events
           ***********************************************************************************************************/
          var timeRemaining = 30
          
          try{
               await pool.query(`UPDATE users_web 
                                   SET isonline = ?, updated_at = ?
                                   WHERE WebID = ?`,[1, new Date(), userInfo.UserID])

          }catch(err){
               console.log("No se pudo registrar el usuario.")
          }

          //Join Queue
          socket.on('join:queue', async ({region, room},) => {

               let getInfo = await pool.query(`CALL getPlayerInformationSpecific(?)`, [userInfo.UserID])
               //Inserta en la cola
               io.to(room).emit('join:queue', getInfo[0][0], region)

               //Verifica que existan 8 en la región
               let queryVerify = await queryPlayersVerify(region)

               //Longitud
               if (queryVerify.length != 8) return;

               let timerId = setInterval(countdown, 1000);

               let verifyAfter = await queryPlayersVerifyCounter(region)

               async function countdown() {
                    //Longitud
                    if (timeRemaining == 1 || verifyAfter.length != 8) {
                              clearTimeout(timerId);
                              timeRemaining = 30;

                              //Longitud
                              if (verifyAfter.length == 8) {
                                   io.to(room).emit("player:left", userInfo.UserID)
                                   let verifyUnready = await queryVerifyUnreadyPlayers(region)
                                   console.log(verifyUnready);
                                   verifyUnready.map( async( player ) =>{ 
                                        let dropQueue = queryDropPlayerQueue(player.userid)
                                        if (dropQueue) {
                                             try{
                                                  //Actualizar estado de todos a 1
                                                  await queryUpdatePlayerStatus(player.region)
                                                  
                                                  io.to(room).emit('drop:queue', player.userid, player.region)
                                             }catch(err){
                                                  console.log(err)
                                             }
                                        }
                                   }) 
                              } else {
                                   io.to(room).emit('player:left', userInfo.UserID)
                                   console.log("Se fue uno");
                              }

                         } else {
                              verifyAfter = await queryPlayersVerifyCounter(region)
                              timeRemaining--;
                              console.log(timeRemaining);
                         }
               }
          });

          //Drop Queue Novice
          socket.on('drop:queue', ({userid, region, room}) => {
               io.to(room).emit('drop:queue', userid, region)
          });

          //After 8 players accept queue
          socket.on('accept:game', async ({userid, room}) => {

               queryUpdatePlayer(userid)

               const getInfoUser = await pool.query(`SELECT * FROM l4d2_queue where userid = ?`, [userid])

               if(getInfoUser.length == 0) return;
               
               io.to(room).emit('accept:game', userid, getInfoUser[0].region)

               //Verifica que hayan 8 para poder empezar la partida.
               let queryVerify = await pool.query(`CALL playerAcceptMatchInformation(?)`,[getInfoUser[0].region])

               //Longitud
               if (queryVerify[0].length == 8) {
                    //isJoined ( ready ) = 2
                    await pool.query('DELETE FROM `4saken`.l4d2_queue WHERE isjoined = 2 and region = ?', getInfoUser[0].region)

                    //Votar a los 8 de la region
                    io.to(room).emit("drop:players", getInfoUser[0].region)
                    
                    let getIP = await getRandomIP();

                    let finishedTeam = await helpers.getTeams(queryVerify[0], getIP)

                    /* let unixTimestamp = Math.floor(Date.now() / 1000);

                    const newMessage = {
                         'userid': 12,
                         'message_body': JSON.stringify(finishedTeam),
                         'room': room,
                         'created_at': unixTimestamp
                    }
                    console.log(newMessage);
                    let gameStarted = await pool.query('INSERT INTO chat_room SET ?', [newMessage]) */

                    /* let selectMessage = await pool.query(`SELECT chat_room.chatid,
                                                                      chat_room.message_body,
                                                                      chat_room.room,
                                                                      chat_room.created_at,
                                                                      users_general.UserID
                                                            FROM 4saken.chat_room
                                                                      INNER JOIN 4saken.users_general
                                                                                ON chat_room.userid = users_general.userid
                                                            WHERE chat_room.userid = ?
                                                                 and chat_room.message_body = ?`, [newMessage.userid, newMessage.message_body]) */
                    
                         //Emitir mensaje global
                         /* io.to(room).emit('message:chat', newMessage) */
                         /* 'teamA': '[' + JSON.stringify(finishedTeam['teamA'][0]) + ',' + JSON.stringify(finishedTeam['teamA'][1]) + ',' + JSON.stringify(finishedTeam['teamA'][2]) + ',' + JSON.stringify(finishedTeam['teamA'][3]) + ']',
                         'teamB': '[' + JSON.stringify(finishedTeam['teamB'][0]) + ',' + JSON.stringify(finishedTeam['teamB'][1]) + ',' + JSON.stringify(finishedTeam['teamB'][2]) + ',' + JSON.stringify(finishedTeam['teamB'][3]) + ']',
                          */
                         const newLobby = {
                              teamA: '[' + JSON.stringify(finishedTeam['teamA'][0]) + ',' + JSON.stringify(finishedTeam['teamA'][1]) + ',' + JSON.stringify(finishedTeam['teamA'][2]) + ',' + JSON.stringify(finishedTeam['teamA'][3]) + ']',
                              teamB: '[' + JSON.stringify(finishedTeam['teamB'][0]) + ',' + JSON.stringify(finishedTeam['teamB'][1]) + ',' + JSON.stringify(finishedTeam['teamB'][2]) + ',' + JSON.stringify(finishedTeam['teamB'][3]) + ']',
                              region: getInfoUser[0].region,
                              map: finishedTeam.map,
                              ip: finishedTeam.ip
                            };
                         await pool.query('INSERT INTO `4saken`.l4d2_queue_game SET ?', [newLobby])
 
                         io.emit("current:games", newLobby)
               }
          })

          /************************************************************************************************************
           * Send Message Events
           * message:chat -> All message information
           * istyping -> Brings if user is currently typing
           ***********************************************************************************************************/

          //Send Message
          socket.on('message:chat', async ({message , room}) => {
               console.log(message)
               const userId = message.userid;
               const currentTime = Date.now();

             
               // initialize message count for user if it doesn't exist
               if (!messageCounts[userId]) {
                    messageCounts[userId] = {
                         count: 0,
                         lastTime: currentTime,
                    };
               }
             
               // check if user has exceeded message limit
               const count = messageCounts[userId].count;
               const lastTime = messageCounts[userId].lastTime;
               const elapsedTime = currentTime - lastTime;
             
               if (count >= 1 && elapsedTime < 1000) { // limit to 10 messages per minute
                    console.log("Too many messages from this user");
                    return;
               }
             
               // update message count and last message time for user
               messageCounts[userId].count += 1;
               messageCounts[userId].lastTime = currentTime;

               // Insert message if user has not exceeded limit
               let unixTimestamp = Math.floor(Date.now() / 1000);

               const getMessageId = await pool.query(`INSERT INTO chat_room (userid, message_body, room, created_at)
                                   VALUES (?, ?, ?,?)`, [message.userid, message.message_body, message.room, unixTimestamp])

               const newMessage = {
                    chatid : getMessageId.insertId,
                    ...message
               }
               console.log("INSERT")
               io.to(room).emit('message:chat', newMessage)

          })

          //Delete Message as Admin
          socket.on('delete:message:admin', ({chatid, room},) => {
               io.to(room).emit('delete:message:admin', chatid)
          });

          //User is typing...
          socket.on('user:typing', ({user, room}) => {
               socket.to(room).emit('user:typing', user)
          })

          /************************************************************************************************************
           *
           ***********************************************************************************************************/

          //Remove Players from queue
          setTimeout(async () => {
               let verifyQueue = await pool.query(`SELECT userid, region, joined_date from 4saken.l4d2_queue`)

               if (verifyQueue.length === 0) return;

               for (let player of verifyQueue) {  
                    if (helpers.currentDate() - player.joined_date > 1800) {

                         queryDropPlayerQueue(player.userid)
                         /**
                          * TODO: PUEDE QUE PIDA ACTUALIZAR ESTADOS, EN ESPERA DEL PROBLEMA
                          */
                         io.emit("drop:unranked", player.userid, player.region)

                    }
               }
          }, 4000)

          socket.on('onunmounted:room',(room) =>{
               console.log(room);
               socket.leave(room);

          })

          socket.on('disconnect', () => {

               connectedSockets = connectedSockets.filter((s) => s !== socket);

               io.emit('disconnect:user', userInfo);

               try{
                    pool.query(`UPDATE users_web SET isonline = 0 WHERE WebID = ?`, [userInfo.UserID])
     
                    console.log(`User ${socket.id} disconnected.`)

               }catch(err){
                    console.log(err);
                    console.log("No se pudo desconectar el usuario");
               }

          })
     })
}