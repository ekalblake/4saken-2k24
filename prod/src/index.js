import app from "./app.js";

/**
 * VARIABLES GLOBALES
 */
import { CLIENT_URL, PORT } from "./config.js";

/**
 * WEBSOCKET SERVER
 */
import { Server as WebsocketServer } from "socket.io";
import http from "http";
import sockets from "./socket/sockets.js";

/**
 * Base de datos
 * @type {Pool}
 */
import pool from "./database.js";

/**
 * ROUTES
 */
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import queueRouter from "./routes/queue.js";
import messagesRouter from "./routes/messages.js";
import adminRouter from "./routes/admin.js";

/**
 * WEB SOCKET
 *
 */

const server = http.createServer(app);
const io = new WebsocketServer(server, {
	cors: {
		origin: [
			"https://4saken.us",
			"https://forsaken-blk.herokuapp.com",
			"http://forsaken-blk.herokuapp.com",
			"http://4saken.us",
			"http://localhost:5001",
			"http://localhost:5173",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
	},
});
sockets(io);

import bodyParser from "body-parser";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * SERVER LISTENING
 */

server.listen(PORT, (err) => {
	if (err) return console.log(err);

	console.log("Server: " + PORT);
});

/*******************************************************************************************************************
 * ROUTES
 ********************************************************************************************************************/

app.get("/", (req, res) => {
	res.redirect(CLIENT_URL);
});
app.use("/auth", authRouter);

/**
 * User Logs
 */
app.use("/user", userRouter);

/*******************************************************************************************************************
 * QUEUE Events
 * Add
 * Delete
 *
 *
 *******************************************************************************************************************/

app.use("/queue", queueRouter);

/*******************************************************************************************************************
 * MESSAGE EVENTS
 *
 *******************************************************************************************************************/

app.use("/messages", messagesRouter);

/*******************************************************************************************************************
 * ADMIN EVENTS
 *
 *******************************************************************************************************************/

app.use("/admin", adminRouter);

/*******************************************************************************************************************
 * EXTRAS
 *
 *******************************************************************************************************************/

/**
 * Get admins Admins
 */
app.get("/getpartners", async (req, res) => {
	const getPartners = await pool.query(
		'SELECT authid FROM `forsaken_sb`.sb_admins WHERE srv_group = "Server Admin" ORDER BY aid ASC',
	);
	res.json(getPartners);
});

/**
 * Fetch all online users and admins connected
 */

app.all("*", (req, res) => {
	res.redirect(CLIENT_URL);
});
