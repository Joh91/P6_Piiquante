const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,"RANDOM_TOKEN_SECRET");
        // ltIX!a$w10ARqvfIb2ZK0spAw8RbEkG4
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next();
    } catch (error) {
        res.status(401).json({error}); 
    }
};