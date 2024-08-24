import _ from "lodash";
import { queryGetIP } from "../querys/extra.querys.js";
import Gamedig from "gamedig";

const helpers = {}

helpers.getTeams = (array, ip) => {

     let teams = _.shuffle(array)

     const middleIndex = Math.ceil(teams.length / 2)

     const firstHalf = teams.splice(0, middleIndex)

     const secondHalf = teams.splice(-middleIndex)

     const map = helpers.randomMaps()


     const newObject = {
          'teamA': firstHalf,
          'teamB': secondHalf,
          'map': map,
          'ip': ip
     }

     return newObject
}

helpers.unixToDate = (date) => {
     const getDate = new Date(date * 1000).toLocaleString();
     return getDate
}

helpers.currentDate = () => {
     return Math.floor(new Date().getTime() / 1000.0)
}

helpers.randomMaps = () => {
     let map = [
          'c1m1_hotel',
          'c2m1_highway',
          'c3m1_plankcountry',
          'c4m1_milltown_a',
          'c5m1_waterfront',
          'c6m1_riverbank',
          'c8m1_apartment',
          'c10m1_caves',
          'c11m1_greenhouse',
          'c12m1_hilltop',
          'c13m1_alpinecreek'
     ]

     return _.sample(map);
}

export const getRandomIP = async () => {

     const getServers = await queryGetIP()

     const servers = getServers.map(server => {
          return {
               'ip': server.ip,
               'port': server.port
          }
     })
     let checkServer = [];

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
               if (data.raw.numplayers == 0) checkServer.push({
                    'name': data.name,
                    'map': data.map,
                    'numplayers': data.raw.numplayers,
                    'players': nombreJugador,
                    'maxplayers': data.maxplayers,
                    'ip': data.connect,
                    'ping': data.ping
               })

          } catch {
               console.log("No se ha podido conectar al servidor: " + server.ip + ':' + server.port)
          }
     } 

     let ip = checkServer.map(( server) => {
          return server.ip;
    })
     return _.sample(ip)
}

//https://codingnconcepts.com/javascript/how-to-divide-array-in-equal-parts-in-javascript/

export default helpers