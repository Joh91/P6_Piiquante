const User = require("../models/User");
// bcrypt va nous permettre de hasher le mdp  
const bcrypt = require("bcrypt"); 

const jwt = require("jsonwebtoken");


/*-- 
Valider le mot de passe
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

if (regex.test(req.body.password)) { ... } else {
        return res.status(401).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, un nombre, une minuscule, et une majuscule' });
    } ---*/ 






// création de compte 
exports.signup = (req, res, next) => {
    //regex
    
    
    
    
    
    bcrypt.hash(req.body.password, 10)
        //la fonction renvoie le mail ainsi que le mdp sous forme de hash desormais 
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
            .then(() => res.status(201).json({ message: "Utilisateur crée !"})) 
            .catch(error => res.status(400).json({error})); 
        })
        .catch(error => res.status(500).json({error}))
};

// connexion à un compte existant
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
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
                            "RANDOM_TOKEN_SECRET",
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