const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please log in.' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.customer = verified; // Attach customer info to req
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken; // Export the middleware