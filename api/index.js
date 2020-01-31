const { readFileSync } = require('fs');
const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const apiRoute = express.Router();
const schema = buildSchema(readFileSync('./api/schemas/main.gql').toString());
const dbContext = require('./../db');
const resolvers = require('./resolvers');

apiRoute.use('/', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    context: dbContext,
    graphiql: true
}));

module.exports = apiRoute;
