const jwt = require('jsonwebtoken')

exports.protect = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Not authorized' })
    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(403).json({ message: 'Token invalid' })
    }
}

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return res.status(403).json({ message: 'Access denied' })
        next()
    }
}
