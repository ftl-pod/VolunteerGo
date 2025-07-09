const jwt = require('jsonwebtoken');

const optionalAuthenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    return next(); // No token = continue as guest
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Invalid token, but don't block the request
    console.warn('Invalid token provided. Proceeding as guest.');
  }

  next();
};

module.exports = optionalAuthenticateToken;
