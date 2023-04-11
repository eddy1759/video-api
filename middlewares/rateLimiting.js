const rateLimit = require('express-rate-limit');

/**
 * @desc A http logging middleware
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many request, please try again later"
})

module.exports = limiter