import {config} from 'dotenv';

config()

export const HOST = process.env.NODE_ENV === 'production' ? process.env.HOST_PROD : process.env.HOST_DEV, 
             BD_PORT = process.env.NODE_ENV === 'production' ? process.env.BD_PORT_PROD : process.env.BD_PORT_DEV, 
             USER = process.env.NODE_ENV === 'production' ? process.env.USER_PROD : process.env.USER_DEV, 
             PASSWORD = process.env.NODE_ENV === 'production' ? process.env.PASSWORD_PROD : process.env.PASSWORD_DEV, 
             CLIENT_URL = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
             API_URL = process.env.NODE_ENV === 'production' ? process.env.API_URL_PROD : process.env.API_URL_DEV


export const PORT = process.env.PORT || 5001;
export const STEAM_API = process.env.STEAM_API, 
             STEAM_API_KEY = process.env.STEAM_API_KEY;

export const HTTP_STATUS = {
    SUCCESSFUL      : 200,
    BAD_REQUEST     : 400,
    UNAUTHORIZED    : 401,
    FORBIDDEN       : 403,
    NOT_FOUND       : 404,
    NOT_ACCEPTABLE  : 406,
    REQUEST_TIMEOUT : 408
}