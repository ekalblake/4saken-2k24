import pool from "../database";

export const setOnline = async (userid) => {
	return new Promise((resolve, reject) => {
		pool.query(
			`UPDATE 
				users_web 
			SET 
				isonline = ?, updated_at = ?
			WHERE 
				WebID = ?`,
			[1, new Date(), userid],
			(err, results) => {
				if (err) {
					return reject(sqlResponse(err));
				}
				resolve(results);
			},
		);
	});
};
