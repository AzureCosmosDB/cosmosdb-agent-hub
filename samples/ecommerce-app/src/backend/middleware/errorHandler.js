const { logger } = require('../utils/logger');

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  // Cosmos DB specific errors
  if (err.code) {
    switch (err.code) {
      case 404:
        return res.status(404).json({
          error: 'Resource not found',
          message: 'The requested resource does not exist'
        });
      case 409:
        return res.status(409).json({
          error: 'Conflict',
          message: 'Resource already exists'
        });
      case 429:
        return res.status(429).json({
          error: 'Too many requests',
          message: 'Request rate too high, please retry after some time'
        });
      case 413:
        return res.status(413).json({
          error: 'Request entity too large',
          message: 'The request payload is too large'
        });
    }
  }
  
  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      message: err.details[0].message,
      details: err.details
    });
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    error: 'Server error',
    message
  });
}

/**
 * Async error wrapper for route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  asyncHandler
};