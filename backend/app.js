/* --- Importations --- */ 

//importation d'Express 
const express = require('express');
//importation express-rate-limiter
const rateLimit = require("express-rate-limit"); 
//importation bodyParser
const bodyParser = require('body-parser');
//importation Helmet 
const helmet = require('helmet');

//limiter Config 
const limiter = rateLimit({
    //100 requête par heure/IP
    max: 100, 
    windowMs: 60 * 60 * 1000, 
    message: "Nombre de tentatives de connexion atteint"
});

//fonction Express 
const app = express();
app.use(express.json()); 
app.use(bodyParser.json());
app.use(limiter); 
app.use(helmet());



//contrôle d'accès
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

//connexion à la database
const mongoose = require("mongoose"); 

mongoose.connect("mongodb+srv://johann:P6_piiquanteDB@cluster0.jeifhdb.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//chemin du server 
const path = require('path');

//connexion aux routes 
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Utilisation du router pour définir les routes 
app.use("/images", express.static(path.join(__dirname, "images")));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);



//exportation d'Express
module.exports = app;