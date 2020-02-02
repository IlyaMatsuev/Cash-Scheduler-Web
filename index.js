const express = require('express');
const bodyParser = require('body-parser');

const apiRoute = require('./api');
const serverConfig = require('./config').server;
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/api', apiRoute);
app.use((request, response) => response.status(404).end());

app.listen(process.env.PORT || serverConfig.port, () => {
    console.log(`Listening to http://${process.env.HOST || serverConfig.host}:${process.env.PORT || serverConfig.port}/`);
    console.log(`API endpoint: http://${process.env.HOST || serverConfig.host}:${process.env.PORT || serverConfig.port}/api`);
});
