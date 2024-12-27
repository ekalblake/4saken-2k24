import pool from "../database.js";

export const setOnline = async (userid) => {
	await pool.query(
		`UPDATE 
			users_web 
		SET 
			isonline = ?, updated_at = ?
		WHERE 
			WebID = ?`,
		[1, new Date(), userid],
	);
};
