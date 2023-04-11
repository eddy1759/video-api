const logger = require('./logger')

/**
 * A middleware that logs HTTP requests and responses
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
const httpLogger = (req, res, next) => {
    const start = new Date();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const method = req.method;
    const url = req.url;
  
    res.on('finish', () => {
      const end = new Date();
      const duration = end - start;
      const status = res.statusCode;
  
      logger.info(`${ip} - ${method} ${url} ${status} ${duration}ms`);
    });
  
    next();
};
  
module.exports = httpLogger;
