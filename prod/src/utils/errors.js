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
