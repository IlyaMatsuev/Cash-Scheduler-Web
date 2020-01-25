const express = require('express');
const bodyParser = require('body-parser');

const serverConfig = require('./config').server;

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || serverConfig.port, () => {
    console.log(`Listening to http://${serverConfig.host}:${serverConfig.port}/`);
});
