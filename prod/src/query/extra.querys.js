import pool from "../database.js";

export const queryGetIP = async () => await pool.query('SELECT *FROM 4saken.l4d2_servers WHERE status = 1 ORDER BY serverid ASC')