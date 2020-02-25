const { readFileSync } = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const apiRoute = express.Router();
const schema = buildSchema(readFileSync('./api/schemas/main.gql').toString());
const dbContext = require('./../db');
const resolvers = require('./resolvers');
const config = require('./../config').crypt;

apiRoute.use('/', (request, response, next) => {
    /*const AUTH_TYPE_NAME = 'Bearer ';
    const authHeader = request.get('Authorization');
    if (authHeader && authHeader.startsWith(AUTH_TYPE_NAME)) {
        jwt.verify(authHeader.split(AUTH_TYPE_NAME).pop(), config.secretKey, (err, decoded) => {
            if (err) {
                response.status(403).end();
                response.end();
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        response.status(401).end();
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
        request: request,
        db: dbContext
    },
    graphiql: true
})));

module.exports = apiRoute;
