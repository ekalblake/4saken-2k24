import {HOST, BD_PORT, USER, PASSWORD} from "./config.js";

export const database = {
    host:HOST,
    port:BD_PORT,
    user:USER,
    password: PASSWORD,
    charset : 'utf8mb4',
    database: "4saken" // Add database name here
}