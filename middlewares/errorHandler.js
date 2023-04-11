const logger = require('./logger')

/**
 * @desc - rror handler middleware to handle and respond to errors.
 * @param {error} error - The error object to be handled
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function.
 * @returns {Object} The JSON response with the error message
 * @throws {error} - if the logger fails to log the error
 */
function errorHandler(error, req, res, next) {
    // Custom Winston logger to log errors
    logger.error(error.message, {error: error})
    // Send appropriate respond based on error status
    res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
    })
}

module.exports = errorHandler