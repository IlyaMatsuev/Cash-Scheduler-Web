const express = require('express');

const viewsDirPath = __dirname + '/pages';
const viewsRoute = express.Router();

viewsRoute.get('/', (request, response) => {
    response.sendFile(viewsDirPath + '/profile-main.html');
});

module.exports = viewsRoute;
