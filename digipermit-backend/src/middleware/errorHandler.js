const { error } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || err);
  const statusCode = err.statusCode || 500;
  return error(res, err.message || 'Internal server error', statusCode);
}

function notFoundHandler(req, res) {
  return error(res, `Route ${req.method} ${req.path} not found`, 404);
}

module.exports = { errorHandler, notFoundHandler };
