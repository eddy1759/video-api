const jwt = require('jsonwebtoken')
const { JWT_SECRET, jwtOptions } = require('../config/config').JWT
const User = require('../models/User')
/**
 * @desc A middleware function to authenticate and authorize a user using JSON Web Tokens (JWT).
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} bext - The next function in the middleware chain
 */
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        const error = new Error('Authorization header not found')
        error.statusCode = 401
        return next(error)
    }

    const [scheme, token] = authHeader.split(' ')

    if (!/^Bearer$/i.test(scheme)) {
        const error = new Error('Invalid authorization scheme')
        error.statusCode = 401;
        return next(error);
    }

    try {
        const payLoad = jwt.verify(token, JWT_SECRET, jwtOptions)
        req.user = payLoad
        next()
    } catch (error) {
        error = new Error('Invalid token')
        error.statusCode = 401
        return next(error)
    }
}

module.exports = authenticate;