const express = require('express');
const recordTypesRoute = express.Router();

recordTypesRoute.get('/', (request, response) => {
    response.json({
        userId: request.userId,
        recordTypes: [

        ]
    });
});

module.exports = recordTypesRoute;
