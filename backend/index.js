const http = require('http');

//importation de l'application 
const app = require("./app");

//définition du port
app.set("port", process.env.PORT || 3000)

//intégration de l'app en parametre de notre fonction server 
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);