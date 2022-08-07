const User = require("../models/User");
// bcrypt va nous permettre de hasher le mdp  
const bcrypt = require("bcrypt"); 
//importation de crypto js pour chiffrer l'adresse mail 
const cryptojs = require("crypto-js");
//importation de jwt pour la création d'une token d'authentification 
const jwt = require("jsonwebtoken");

// création de compte 
exports.signup = (req, res, next) => {
    //regex
    //au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    const regexPassword = (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    const regexEmail = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

    if (regexPassword.test(req.body.password) && regexEmail.test(req.body.email)) { 
        //chiffrage de l'adresse-mail
        const emailCryptoJs = cryptojs.SHA256(req.body.email, process.env.SECRET_KEYS).toString();
        //hashage du mot de passe
        bcrypt.hash(req.body.password, 10)
        //la fonction renvoie le mail ainsi que le mdp sous forme de hash desormais 
        .then(hash => {
            const user = new User({
                email: emailCryptoJs,
                password: hash,
            });
            user.save()
            .then(() => res.status(201).json({ message: "Utilisateur crée !"})) 
            .catch(error => res.status(400).json({error})); 
        })
        .catch(error => res.status(500).json({error}))
    } else {
        return res.status(401).json({ message: 'Veuillez saisir une adresse mail valide et un mot de passe contenant au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et un 1 caractère spécial' });
    }
};

// connexion à un compte existant
exports.login = (req, res, next) => {
    const emailCryptoJs = cryptojs.SHA256(req.body.email, process.env.SECRET_KEYS).toString();
    User.findOne({email: emailCryptoJs})
    .then(user => {
        if (user === null){
            res.status(401).json({message: "identifiant et/ou mot de pas incorrect(s)"}); 
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    res.status(401).json({message: "identifiant et/ou mot de pas incorrect(s)"})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.TOKEN_PASSWORD,
                            {expiresIn: "24h"}
                        )
                    }); 
                }
            })
            .catch(error => {
                res.status(500).json({error});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error}); 
    })
};