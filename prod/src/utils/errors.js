const errors = {};

errors.response = (status, msg) => {
	return {
		success: false,
		HTTP_STATUS: status,
		msg: msg,
	};
};
errors.success = (status, msg) => {
	return {
		success: true,
		HTTP_STATUS: status,
		msg: msg,
	};
};

export default errors;

export const responseSuccess = (status, data) => {
	return {
		success: true,
		status,
		data,
	};
};

export const responseError = (status, data, message) => {
	return {
		success: false,
		status,
		data,
		message,
	};
};

export const sqlResponse = (data) => {
	return {
		code: data.code,
		errno: data.errno,
	};
};

export const sendResponse = (res, status, data, message = "") => {
	res.status(status).json({
		success: status < 400,
		message,
		data,
	});
};

export const sendResponseObj = (res, status, data) => {
	res.status(status).json(data);
};

export const handleSocketError = (socket, event, error, userid, message = "") => {
	const formattedError = {
		data: null,
		message: error instanceof Error ? error.message : message,
		success: false,
	};

	socket.to(userid).emit(event, formattedError);
};
