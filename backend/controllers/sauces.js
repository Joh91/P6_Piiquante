//importation du modèle de données Sauce
const Sauce = require('../models/Sauce');

/*- importation du package fs qui permet d'accèder aux fonctions de suppression et 
de modification d'un fichier -*/ 
const fs = require('fs');

/* ------ requête POST --------*/ 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    //l'id n'est pas nécessaire car il est directement généré par la BDD
    delete sauceObject._id;
    //l'id en provenance du token sera celui utilisé pour l'authentification pour des raisons de sécurité 
    delete sauceObject.userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        // multer ne transmet que le nom, nous créeons ainsi l'URL manuellement
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    console.log(sauce); 
    sauce.save()
    .then(() => {res.status(201).json({message: 'Création de la sauce'})})
    .catch(error => {res.status(400).json({error})})
};

/* ----- requête GET (un produit) ------ */ 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error})})
};

/* ------ requête GET (tous les produits) -------*/ 
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(400).json({error: error})})
};

/*--------- requête PUT ----------*/
exports.modifySauce = (req, res, next) => {
  //valeurs à modifier; "req files ? " vérifie si un fichier à été ajouté 
  //1er cas: un nouveau fichier est retourné 
  const sauceObject = req.file 
  ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } 
  //2e cas: pas de nouveau fichier ajouté
  : {...req.body}; 

  //suppression de l'user id dans notre objet pour des raisons de sécurité 
  delete sauceObject.user_id; 
  

  Sauce.findOneAndUpdate({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then((sauce) => {
    //auth
    if (sauce.userId != req.auth.userId){
        res.status(401).json({ message : "Non-autorisé"});
    } else {
      //récupération du fichier précédent et suppression
        let oldFile = sauce.imageUrl.split('images/')[1];
        fs.unlink(`images/${oldFile}`, (err) => { if (err) throw err})
        res.status(200).json ({message: "Produit modifié !"})
    }
  })
  .catch((error) => {
    res.status(400).json({error})
  })
};

/* ------- requête DELETE -------- */ 
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({message: "non-authorisé"});
      } else {
        const filename = sauce.imageUrl.split("/images/")[1]; 
        fs.unlink(`images/${filename}`, () => {
            sauce.deleteOne({_id: req.params.id})
            .then(() => {res.status(200).json({message: "produit supprimé !"})})
            .catch(error => res.status(401).json({ error }));
        })
      }
    })
  .catch(
    (error) => {
      res.status(500).json({error});
    })
};

