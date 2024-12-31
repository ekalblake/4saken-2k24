import app from "./app.js";

import { CLIENT_URL, PORT } from "./config.js";

import http from "http";
import socketSetup from "./socket/sockets.js";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import queueRouter from "./routes/queue.js";
import chatRouter from "./routes/messages.js";
import adminRouter from "./routes/admin.js";

const server = http.createServer(app);

socketSetup(server);

import bodyParser from "body-parser";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(PORT, (err) => {
	if (err) return console.log(err);

	console.log("Server: " + PORT);
});

app.get("/", (req, res) => {
	res.redirect(CLIENT_URL);
});

app.use("/auth", authRouter);

app.use("/user", userRouter);

app.use("/queue", queueRouter);

app.use("/chat", chatRouter);

app.use("/admin", adminRouter);

app.all("*", (req, res) => {
	res.redirect(CLIENT_URL);
});
