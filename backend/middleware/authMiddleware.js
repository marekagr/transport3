
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sekretnykluczdoaplikacji-transport2';

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach payload (e.g. userId) to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};