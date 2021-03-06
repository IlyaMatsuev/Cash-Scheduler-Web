const express = require('express');
const expressWebSocket = require('express-ws');
const bodyParser = require('body-parser');

const workersHelper = require('./workers');
const errorsHandler = require('./errors');
const serverConfig = require('./config').server;

const app = express();
expressWebSocket(app);

const apiRoute = require('./api');
const authRoute = require('./auth');
const viewsRoute = require('./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use('/api', apiRoute);
app.use('/auth', authRoute);
app.use('/account', viewsRoute);
app.use((request, response) => errorsHandler.throwHttpError(response, null, 404));

workersHelper.initWorkers();

app.listen(process.env.PORT || serverConfig.port, () => {
    console.log(`Listening to http://${process.env.HOST || serverConfig.host}:${process.env.PORT || serverConfig.port}/`);
    console.log(`API endpoint: http://${process.env.HOST || serverConfig.host}:${process.env.PORT || serverConfig.port}/api`);
});
