var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var GraphQLJSON = require('graphql-type-json');

var data = require('./data.json');

var resultType = new graphql.GraphQLObjectType({
    name: 'resultType',
    fields: {
        id: { type: graphql.GraphQLID },
        name: { type: graphql.GraphQLString },
        params: { type: GraphQLJSON },
    },
});

var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: resultType,
                args: {
                    params: { type: GraphQLJSON },
                    id: { type: graphql.GraphQLInt },
                },
                resolve: function (_, args) {
                    return Object.assign(data[args.id], {params: args.params});
                }
            }
        }
    })
});

express().use('/graphql', graphqlHTTP({
    schema: schema,
    pretty: true,
    graphiql: true,
    rootValue:'fang',
    formatError: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path
    }),
    extensions({ document, variables, operationName, result }) {
        return 1;
    },
}))
.listen(4000);

console.log('GraphQL server running on http://localhost:4000/graphql');
