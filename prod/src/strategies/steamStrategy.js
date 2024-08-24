import passport from "passport";
import passportSteam from 'passport-steam'
import { API_URL, STEAM_API_KEY } from "../config.js";
import pool from '../database.js'

// Initiate Strategy
passport.serializeUser((user, done) => {
     done(null, user);
});
passport.deserializeUser((user, done) => {
     done(null, user);
});
const SteamStrategy = passportSteam.Strategy;

passport.use(new SteamStrategy({
     returnURL: API_URL + 'auth/redirect',
     realm: API_URL,
     apiKey: STEAM_API_KEY
}, async (identifier, profile, done) => {
     try {
          const getSteamId = profile.id

          const verifyUserExist = await pool.query('SELECT SteamID64 FROM users_general WHERE SteamID64 = ?', [getSteamId])

          if (verifyUserExist.length == 0) {

               const WebID = await pool.query('SELECT WebID FROM users_general ORDER BY WebID DESC LIMIT 1')

               const { personaname, avatarfull, profileurl, personastate, timecreated } = profile._json;

               const newIndex = WebID[0].WebID + 1

               const steamUser = {
                    WebID : newIndex,
                    personaname,
                    avatarfull,
                    profileurl,
                    timecreated,
                    personastate
               }

               const insertIntoWeb = await pool.query(`INSERT INTO 4saken.users_web
                                 SET ?
                                 ON DUPLICATE KEY UPDATE
                                 WebID = ?, 
                                   personaname = ?,
                                   avatarfull = ?,
                                   personastate = ?`, [steamUser, steamUser['WebID'], steamUser['personaname'], steamUser['avatarfull'], steamUser['personastate']]);
               
               const insertId = insertIntoWeb.insertId;

               await pool.query(`INSERT INTO 4saken.users_general
                              (SteamID64, WebID, Pug_MMRID, Duel_MMRID, PermisionsID)
                              VALUES (?,?,?,?,?)`, [getSteamId, insertId, insertId, insertId, insertId])
          }

          done(null, profile);
     } catch (err) {
          console.log(err)
          done(profile, null);
     }

}
));

