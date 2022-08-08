//importation de JWT
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        //récupération du Token 
        const token = req.headers.authorization.split(' ')[1];
        //décodage du Token 
        const decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next();
    } catch (error) {
        res.status(401).json({error}); 
    }
};