const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const apiRoute = require('./api');
const authRoute = require('./auth');
const viewsRoute = require('./views');

const errorsHandler = require('./errors');
const serverConfig = require('./config').server;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use('/api', apiRoute);
app.use('/auth', authRoute);
app.use('/views', viewsRoute);
app.use((request, response) => errorsHandler.throwHttpError(response, null, 404));

app.listen(process.env.PORT || serverConfig.port, () => {
    console.log(`Listening to http://${process.env.HOST || serverConfig.host}:${process.env.PORT || serverConfig.port}/`);
    console.log(`API endpoint: http://${process.env.HOST || serverConfig.host}:${process.env.PORT || serverConfig.port}/api`);

    fs.writeFile(__dirname + '/auth/granted-tokens.json', '{}', () => {});
    fs.writeFile(__dirname + '/auth/verification-tokens.json', '{}', () => {});
});
