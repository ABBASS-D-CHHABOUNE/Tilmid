const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    console.log('Authorization Header:', authHeader) // DEBUG LOG

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7)
    console.log('Token:', token) // DEBUG LOG

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded Token:', decoded) // DEBUG LOG

    // Set req.user
    req.user = {
      _id: decoded.userId,
      userId: decoded.userId,
      role: decoded.role,
    }
    
    console.log('req.user set:', req.user) // DEBUG LOG

    next()
  } catch (error) {
    console.error('Auth Error:', error.message) // DEBUG LOG
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = auth