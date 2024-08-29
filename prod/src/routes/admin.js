import express from 'express'
import {addServer, deleteServer, getServerListPublic, addMap, getServerListAdmin} from "../controllers/admin.controller.js";
import {isAuthorized} from "../auth/auth-steam.js";

const router = express.Router()

router
    .get('/servers', getServerListAdmin)
    .get('/servers_public', getServerListPublic)
    .delete('/servers/:serverid', isAuthorized, deleteServer)
    .post('/servers/add', isAuthorized, addServer)
    .get('/maps', addMap)

export default router;