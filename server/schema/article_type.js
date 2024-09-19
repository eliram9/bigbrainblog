const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const TextType = require('./text_type'); // Ensure this path is correct
const Article = mongoose.model('article');

const ArticleType = new GraphQLObjectType({
    name: 'ArticleType',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        openingImageUrl: { type: GraphQLString }, // Added openingImageUrl field
        texts: {
            type: new GraphQLList(require('./text_type')), // Dynamically require to avoid circular dependency
            resolve(parentValue) {
                return Article.findTexts(parentValue.id);
            }
        },
        createdDate: { type: GraphQLString }
    })
});

module.exports = ArticleType;