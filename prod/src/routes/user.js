import express from 'express'
import {isAuthorized}  from "../auth/auth-steam.js";
import {registerUser, listUser, onlineListUser, configUser, failedUser, getUserMmr} from '../controllers/user.controller.js'

const router = express.Router()

router
    .get("/failed", failedUser)
    /**
     *   Gets user information after upload
     */
    .get('/start', isAuthorized, registerUser)
    /**
     *   Fetch all users for leaderboard
     */
    .get('/get/users', listUser)
    /**
     * GET ONLINE USERS
     */
    .get('/get/onlineusers', onlineListUser)
    /**
     * User Configuration : Glow Color
     */
    .put('/config', configUser)
    .get('/get/mmr', getUserMmr)

export default router;