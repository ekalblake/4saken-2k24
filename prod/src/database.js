import mysql from "mysql2";
import { promisify } from "util";

import { database } from "./keys.js";

const pool = mysql.createPool(database);

pool.query = promisify(pool.query).bind(pool);

pool.on("error", (err) => {
	console.error("Database error:", err);
});

pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			return console.error("DATABASE CONNECTION WAS CLOSED");
		}
		if (err.code === "ER_CON_COUNT_ERROR") {
			return console.error("DATABASE HAS MANY CONNECTIONS");
		}
		if (err.code === "ECONNREFUSED") {
			return console.error("DATABASE CONNECTION WAS REFUSED");
		}
	}
	if (connection) connection.release();
	console.log("DB IS CONNECTED");
	return;
});

//Promisify pool query
pool.query = promisify(pool.query);

export default pool;
