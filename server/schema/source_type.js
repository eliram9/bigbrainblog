const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

const SourceType = new GraphQLObjectType({
    name: 'SourceType',
    fields: () => ({
        id: { type: GraphQLID },
        sourceName: { type: GraphQLString },
        url: { type: GraphQLString },
    }),
});

module.exports = SourceType;