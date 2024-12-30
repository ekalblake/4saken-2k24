import pool from "../database.js";

export const getActiveServers = async () => {
	return await pool.query(
		`
		SELECT
			serverid,
			ip,
			port
		FROM 
			l4d2_servers 
		WHERE
			status = 1
		AND
			availability = 'FREE'
		ORDER BY
			serverid 
		ASC`,
	);
};

export const reserveServer = async (ipPort, availability) => {
	const ip = ipPort.split(":")[0];

	await pool.query(
		`
			UPDATE
				l4d2_servers
			SET
				availability = ?
			WHERE
				ip = ?
		`,
		[availability, ip],
	);
};

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
