const http = require('http');

//importation de l'application 
const app = require("./app");

//définition du port
app.set("port", process.env.PORT || process.env.SERVER_PORT )

//intégration de l'app en parametre de notre fonction server 
const server = http.createServer(app);
server.listen(process.env.PORT || process.env.SERVER_PORT );