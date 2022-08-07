// importation du model User permettant de définir les données à envoyer 
const User = require("../models/User");
// bcrypt va nous permettre de hasher le mdp  
const bcrypt = require("bcrypt"); 
//importation de crypto js pour chiffrer l'adresse mail 
const cryptojs = require("crypto-js");
//importation de jwt pour la création du token d'authentification 
const jwt = require("jsonwebtoken");

/* -------- création de compte -------*/ 
exports.signup = (req, res, next) => {
    //Utilisation de regex pour garantir le bon format de l'adresse mail et assurer un mdp fort 
    //au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    const regexPassword = (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    const regexEmail = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

    // contrôle des champs enregistrés 
    if (regexPassword.test(req.body.password) && regexEmail.test(req.body.email)) { 
        //chiffrage de l'adresse-mail
        const emailCryptoJs = cryptojs.SHA256(req.body.email, process.env.SECRET_KEYS).toString();
        //hashage du mot de passe
        bcrypt.hash(req.body.password, 10)
        //la fonction renvoie le mail  crypté ainsi que le mdp sous forme de hash  
        .then(hash => {
            const user = new User({
                email: emailCryptoJs,
                password: hash,
            });
            // new profil enregistré dans la db 
            user.save()
            .then(() => res.status(201).json({ message: "Utilisateur crée !"})) 
            .catch(error => res.status(400).json({error})); 
        })
        .catch(error => res.status(500).json({error}))
    } 
    // Si la saisie des champs ne respecte pas notre condition 
    else {
        return res.status(401).json({ message: 'Veuillez saisir une adresse mail valide et un mot de passe contenant au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et un 1 caractère spécial' });
    }
};

/* ---- connexion à un compte existant ---- */ 
exports.login = (req, res, next) => {
    //chiffrage de l'adresse-mail
    const emailCryptoJs = cryptojs.SHA256(req.body.email, process.env.SECRET_KEYS).toString();
    //Correspondance entre l'email saisie et celle enregistrée dans la db 
    User.findOne({email: emailCryptoJs})
    .then(user => {
        // si la correspondance n'aboutie pas 
        if (user === null){
            res.status(401).json({message: "identifiant et/ou mot de pas incorrect(s)"}); 
        } 
        // si correspondance
        else {
            // correspondance entre le mdp scripté et enregistré dans la db et celui saisi
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // si la correspondance n'aboutie pas 
                if(!valid) {
                    res.status(401).json({message: "identifiant et/ou mot de pas incorrect(s)"})
                } 
                // si correspondance retourne l'userId et le token d'authentification 
                else {
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