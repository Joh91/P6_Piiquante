/* --- Importations --- */
//importation d'Express 
const express = require('express');
//importation bodyParser
const bodyParser = require('body-parser');
//importation Helmet 
const helmet = require('helmet');

const path = require('path')
//importation Dotenv 
require('dotenv').config({path:"./config/.env"});
//connexion aux routes 
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// importation mongoSanitize
const mongoSanitize = require('express-mongo-sanitize');

//Intégrations 
const app = express();
app.use(express.json()); 
app.use(bodyParser.json()); 
app.use(helmet());

/*----- Securité -----*/
//contrôle d'accès
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});
//configuration mongoSanitize 
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);

//connexion à la database
const mongoose = require('mongoose'); 
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.jeifhdb.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation du router pour définir les routes ;
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//exportation d'Express vers index.js 
module.exports = app;