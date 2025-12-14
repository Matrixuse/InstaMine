// src/middleware/errorHandler.js

/**
 * Global error handler middleware.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging

    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected server error occurred.';

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

module.exports = { errorHandler };