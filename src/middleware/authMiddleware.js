const jwtUtils = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const decodedToken = jwtUtils.verifyToken(token);
    if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    
    req.user = decodedToken;

    next();
};

module.exports = authenticateToken;
