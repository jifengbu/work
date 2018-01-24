var { buildSchema } = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var { makeExecutableSchema } = require('graphql-tools');
var GraphQLJSON = require('graphql-type-json');

var data = require('./data.json');

var typeDefs = `
scalar JSON
type Query {
    user(id: Int, params: JSON): JSON
}`;
var resolvers = {
    JSON: GraphQLJSON,
    Query: {
        user: (_, args)=>Object.assign(data[args.id], args.params),
    }
}
var schema = makeExecutableSchema({typeDefs, resolvers});

express()
.use('/graphql', graphqlHTTP({
    schema,
    pretty: true,
}))
.listen(4000);

console.log('GraphQL server running on http://localhost:4000/graphql');
