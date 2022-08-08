// importation de multer qui va nous permettre de gérer l'exploitation des fichiers 
const multer = require("multer");

// Définition des formats acceptés 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // précise où seront enregistrés les fichiers 
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    // précise le nouveau nom retourné au fichier 
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype]; 
        callback(null, name + Date.now() + "." + extension); 
    }
});

module.exports = multer({storage}).single("image"); 