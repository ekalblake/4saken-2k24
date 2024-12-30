import pool from "../database.js";

export const getServerList = async () => {
	const getServers = await pool.query(
		`
			SELECT
				*
			FROM 
				l4d2_servers
			WHERE 
				status = 1
			ORDER BY 
				serverid ASC`,
	);

	return getServers;
};

export const addServer = async (ip, extra, port) => {
	const newServer = await pool.query(
		`
			INSERT INTO 
				l4d2_servers (ip, extra, port)
			VALUES 
			(?, ?, ?)`,
		[ip, extra, port],
	);

	const [getServer] = await pool.query(
		`
			SELECT
				*
			FROM
				l4d2_servers
			WHERE
				serverid = ?
		`,
		[newServer.insertId],
	);
	return getServer;
};

export const verifyAdmin = async (userid) => {
	let [verifyAdmin] = await pool.query(
		`SELECT 
			users_permisions.Rol
		FROM 
			users_general
		INNER JOIN 
			users_permisions
		ON 
			users_general.UserID = users_permisions.PermisionsID     
		WHERE 
			users_general.UserID = ?
		LIMIT 1`,
		[userid],
	);
	return verifyAdmin;
};

export const deleteServerAdmin = async (serverid) => {
	await pool.query(
		`DELETE FROM
			l4d2_servers 
		WHERE 
			serverid = ?`,
		[serverid],
	);
};
