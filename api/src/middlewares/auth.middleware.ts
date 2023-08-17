const memcached = require('./helpers/memcache')
const jwt = require('express-jwt');
import * as process from "process";

export const AuthMiddleware = jwt({
    secret: process.env.APP_KEY,
    credentialsRequired: true,
    algorithms: ['HS256'],
    requestProperty: "auth",
    isRevoked: async function (req, payload, done) {

        if (process.env.NODE_ENV === 'development') {
            return done(null, false);
        }

        const username = payload.username
        try {
            let lock = await memcached.get(`${username}_is_banned`)
            if (lock) {
                return done(null, true);
            }
        } catch (e) {
            console.error(e);
            await memcached.set(`${username}_is_banned`, false);
        }
        return done(null, false);
    },
    getToken: function fromHeaderOrQuerystring(req) {
        // let logger = new Logger(req.ip);
        // logger.debug(`Authenticate Middleware Executing...`)
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null
    }
});
