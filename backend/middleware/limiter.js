//importation express-rate-limiter
const rateLimit = require('express-rate-limit'); 

//limiter Config 
const limiter = rateLimit({
    //10 requête par heure/IP
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Nombre de requêtes atteint, réessayer dans 1 heure'
});

module.exports = limiter;