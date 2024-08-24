import express from 'express'
import morgan from 'morgan'
import cors from 'cors';
import {STEAM_API} from "./config.js";
import passport from 'passport';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import {database} from './keys.js';

import * as strategy from './strategies/steamStrategy.js';

var app = express();

app.use(cors({
        origin: ['https://4saken.us','https://forsaken-blk.herokuapp.com','http://forsaken-blk.herokuapp.com','http://4saken.us', 'http://localhost:5001', 'http://localhost:8080','https://api.apis.net.pe/'],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
));

const inProd = process.env.NODE_ENV === "production";

let sessionStore = new MySQLStore(database);

app.enable('trust proxy',true);

app.use(session({
    secret: STEAM_API,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 604800000,
        secure: `${inProd ? "true" : "auto"}`, // only https // auto when in development, true when in prod
        httpOnly: false,
        sameSite: `${inProd ? "none" : "lax"}`, // cross site // set lax while working with http:localhost, but none when in prod
    },
    expires: true,
    name:'4saken-session',
    store: sessionStore,
    proxy: true,
    rolling: true,
    waitTime: 0,
    sendTime: 0,
    userid : 0, 
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'))

export default app;