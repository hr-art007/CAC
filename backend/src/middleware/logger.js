const morgan = require('morgan');
const logger = require('../utils/logger');

const stream = {
  write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream }
);

module.exports = morganMiddleware;
