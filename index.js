const express = require('express');
const bodyParser = require('body-parser');

const usersRoute = require('./api/users');
const errorsRoute = require('./api/errors');

const serverConfig = require('./config').server;
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/users', usersRoute);
app.use('/errors', errorsRoute);
app.use((request, response) => response.status(404).end());

app.listen(process.env.PORT || serverConfig.port, () => {
    console.log(`Listening to http://${serverConfig.host}:${serverConfig.port}/`);
});
