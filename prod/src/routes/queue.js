import express from 'express'
import {HTTP_STATUS} from "../config.js";
import pool from "../database.js";
import {isAuthorized} from '../auth/auth-steam.js';
import errors from '../utils/errors.js'
import steam from 'steamidconvert';

import {dropQueue, joinQueue, dropQueueAdmin, listQueue, currentGames, matchStatus, getMatchInfo, matchStatusV2, getQueueStatus} from '../controllers/queue.controller.js'
import {isBanned} from "../middleware/verifybanned.middleware.js";
import { isAdmin } from '../middleware/verifyadmin.middleware.js';

const router = express.Router()

router
    /**
     * JOIN Queue : Verify if player is joined
     */
    .post('/join', isAuthorized, /* isBanned, */ joinQueue)
    /**
     * DROP Queue: Drop player from Queue
     */
    .delete('/drop/:region', isAuthorized,  dropQueue)
    /**
     * DROP Queue: Drop player from Queue as Admin
     */
    .delete('/drop/admin/:userid/:region', isAuthorized, isAdmin, dropQueueAdmin)
    /**
     * GET Queue: List
     */
    .get('/list',listQueue)
    /**
     * GAME STARTED
     */
    .get('/checkqueue', isAuthorized, async (req, res) =>{
        const steamid  = steam().convertToText(req.session.passport.user.id)

        const verifyStatus = await pool.query('SELECT isjoined FROM `4saken`.l4d2_queue where isjoined = 2 and region = 4 and steamid = ?',[steamid])

        if(verifyStatus.length != 0 ){
            res.json(errors.response(HTTP_STATUS.SUCCESSFUL,"Ready"))
        }else{
            res.json(errors.response(HTTP_STATUS.REQUEST_TIMEOUT,"Unready"))
        }

        /**
         * Validar si existe un dato para ver si lo sacamos o no.
         */

    })
    /**
     * GET Queue Games: Current Games Playing
     */
    .get('/currentgames',currentGames)
    
    .get('/matchstatus', matchStatus)
    
    .get('/matchstatusV2', matchStatusV2)
    
    .get('/get-match-info',getMatchInfo)

    .get('/get-queue-status/:gametype', getQueueStatus)

export default router;