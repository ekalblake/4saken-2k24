const errors = {}

errors.response = (status, msg) => {
    return {
        success: false,
        HTTP_STATUS : status,
        msg: msg
    }
}
errors.success = (status, msg) => {
    return {
        success: true,
        HTTP_STATUS : status,
        msg: msg
    }
}

export default errors;