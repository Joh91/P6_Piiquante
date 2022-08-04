//importation 
const passwordValidator = require("password-validator"); 

//Création du schéma du mot de passe
const Schema = new passwordValidator(); 
Schema
.is().min(8)                                    // Minimum length 8
.is().max(25)                                  // Maximum length 25
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase(1)                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

//qualité du mot de passe 
module.exports = (req, res, next) => {
if (Schema.validate(req.body.password)){
    return next()
} else {
    return res.status(400).json({error: 
        "Le mot de passe n'est pas assez fort: doit contenir entre 8 à 25 caractères; et au moins 1 majuscule, 1 minuscule et 1 chiffre"
    })
}}





/*-- 
Valider le mot de passe
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

if (regex.test(req.body.password)) { ... } else {
        return res.status(401).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, un nombre, une minuscule, et une majuscule' });
    } ---*/ 