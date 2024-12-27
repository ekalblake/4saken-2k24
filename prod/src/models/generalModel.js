import pool from "../database.js";
import { sqlResponse } from "../utils/errors.js";

export const queryGetIP = async () =>
	await pool.query("SELECT *FROM 4saken.l4d2_servers WHERE status = 1 ORDER BY serverid ASC");

export const disconnectUser = async (UserID) => {
	await pool.query(
		`
		UPDATE 
			users_web 
		SET 
			isonline = 0 
		WHERE 
			WebID = ?`,
		[UserID],
	);
};
