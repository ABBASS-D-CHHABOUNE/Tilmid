const role = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role

    if (!userRole) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
      })
    }

    // Attach teacher or student to req for convenience
    if (userRole === 'TEACHER') {
      req.teacher = { _id: req.user._id }
    }
    if (userRole === 'STUDENT') {
      req.student = { _id: req.user._id }
    }

    next()
  }
}

module.exports = role