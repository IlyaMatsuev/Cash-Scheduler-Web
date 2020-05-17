const { readFileSync } = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const apiRoute = express.Router();
const schema = buildSchema(readFileSync('./api/schemas/main.graphql').toString());
const dbContext = require('./../db');
const resolvers = require('./resolvers');
const errorsHandler = require('./../errors');
const config = require('./../config').crypt;

apiRoute.use('/', (request, response, next) => {
    /*const authHeader = request.get('Authorization');
    if (authHeader && authHeader.startsWith(config.authType)) {
        jwt.verify(authHeader.split(config.authType).pop(), config.accessTokenSecret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    errorsHandler.throwHttpError(response, 5, 401);
                } else {
                    errorsHandler.throwHttpError(response, null, 403);
                }
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        errorsHandler.throwHttpError(response, null, 403);
    }*/
    request.user = {
        id: 1,
        first_name: "Ilya",
        last_name: "Matsuev",
        email: "matsuev2000@mail.ru",
        password: "$2b$12$4MXtoIFWOnhZSA/1yDzS..XQ3gaC1z3ZzUy8Cqd67vjftvGpMmvMi"
    };
    next();
});

apiRoute.use('/', graphqlHTTP(request => ({
    schema: schema,
    rootValue: resolvers,
    context: {
        user: request.user,
        db: dbContext
    },
    graphiql: true
})));

module.exports = apiRoute;
