/**
 * Custom Logger Middleware
 * Logs incoming HTTP requests in the format: [TIMESTAMP] METHOD URL
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl || req.url}`);
  next();
};

module.exports = logger;
