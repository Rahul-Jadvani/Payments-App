const { tokenSecret } = require('../Token/config')
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => { 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Forbidden: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, tokenSecret);

        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

module.exports = {
    authMiddleware
};
