const jwt = require('jsonwebtoken');
const admin = require('../firebase/firebaseAdmin');

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


const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  verifyFirebaseToken,
  optionalAuthenticateToken
};
