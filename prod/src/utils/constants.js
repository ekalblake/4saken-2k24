export const USER_MESSAGES = {
	USER_INFORMATION_GENERAL_ERROR: "Error al obtener la información del usuario",
	USER_INFORMATION_SUCCESSFUL: "Información del usuario obtenida con éxito",
	USER_PARTY_VERIFICATION_ERROR: "Error al verificar el estado de la party",
	USER_PARTY_VERIFICATION_SUCCESSFUL: "Estado de la party verificado con éxito",
	USER_PARTY_CREATE_SUCCESSFUL: "Se creó la sala correctamente",
	USER_PARTY_CREATE_ERROR: "Error al crear la party",
	USER_PARTY_DROP_MEMBER_ERROR_PARAM: "Error al eliminar miembro de la party, parámetros incorrectos",
	USER_PARTY_DROP_MEMBER_SUCCESSFUL: "Has salido correctamente de la sala",
	USER_PARTY_DROP_MEMBER_GENERAL_ERROR: "Error al salir de la cola",
	USER_PARTY_DROP_ERROR_PARAM: "Error al eliminar la party, parámetros incorrectos",
	USER_PARTY_DROP_GENERAL_ERROR: "Error al eliminar la party",
	USER_PARTY_DROP_SUCCESSFULL: "Se ha eliminado la party correctamente",
	USER_PARTY_JOIN_MEMBER_ERROR_PARAMS: "Error al unirse a la party, parámetros incorrectos",
	USER_PARTY_JOIN_NOT_FOUND: "No se ha encontrado la party",
	USER_PARTY_JOIN_GENERAL_ERROR: "Error general al unirse a la party",
	USER_PARTY_JOIN_SUCCESSFUL: "Te has unido a la party correctamente",
	USER_GET_CONNECTION_SUCCESSFUL: "Verificación de usuarios en linea",
	USER_GET_CONNECTION_STATUS_ERROR: "Hubo un error al verificar los usuarios en linea",
	USER_REGION_ERROR_PARAM: "Parámetros incompletos",
	USER_REGION_ERROR_GENERAL: "Error general al actualizar la región",
	USER_REGION_SUCCESSFUL: "Región actualizada",
	USER_CURRENT_GAME_GENERAL_ERROR: "Hubo un error general al buscar el juego actual",
	USER_CURRENT_GAME_SUCCESS: "Juego encontrado correctamente",
	USER_ONLINE_LIST_SUCCESS: "Usuarios en linea encontrados",
	USER_ONLINE_LIST_GENERAL_ERROR: "Error general al listar los usuarios",
};

export const QUEUE_MESSAGES = {
	QUEUE_JOIN_ROOM_NOT_FOUND: "Parámetros incorrectos",
	QUEUE_JOIN_NOT_REGION_DETECTED: "Por favor selecciona una región",
	QUEUE_JOIN_GENERAL_ERROR: "Error general al unirse a la cola",
	QUEUE_JOIN_ALREADY_JOINED: "Ya estás en la cola",
	QUEUE_JOIN_ALREADY_GAME: "Ya estás en una partida",
	QUEUE_JOIN_WAIT_TIME: "Vuelve a intentarlo en unos segundos",
	QUEUE_JOIN_SUCCESSFUL: "Te has unido a la cola correctamente",
	QUEUE_LIST_ERROR_PARAM: "Parámetros incorrectos al listar la cola",
	QUEUE_LIST_ERROR_GENERAL: "Error general al listar la cola",
	QUEUE_LIST_SUCCESSFUL: "Lista de usuarios",
	QUEUE_DROP_SUCCESSFUL: "Se salio de la cola correctamente",
	QUEUE_DROP_GENERAL_ERROR: "Hubo un error general al salir de la cola",
};

export const SOCKET_MESSAGES = {
	SOCKET_DISCONNECT_ERROR: "Hubo un error al desconectarse del socket",
};
