//importation d'Express 
const express = require('express');
const app = express();

//connexion aux routes 
const stuffRoutes = require('./routes/stuff');

//connexion à la database
const mongoose = require("mongoose"); 

mongoose.connect("mongodb+srv://johann:P6_piiquanteDB@cluster0.jeifhdb.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
//   });


// Utilisation  du router pour définir les routes 
app.use('/api/stuff', stuffRoutes);

//exportation d'Express
module.exports = app;