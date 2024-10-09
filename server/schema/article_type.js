const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const TextType = require('./text_type');
const SourceType = require('./source_type');
const Article = mongoose.model('article');

const ArticleType = new GraphQLObjectType({
    name: 'ArticleType',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        category: { type: GraphQLString },
        summary: { type: GraphQLString },
        openingImageUrl: { type: GraphQLString },
        texts: {
        type: new GraphQLList(require('./text_type')),
            resolve(parentValue) {
                return Article.findTexts(parentValue.id);
            }
        },
        sources: {
            type: new GraphQLList(SourceType),
            resolve(parentValue) {
                return Article.findById(parentValue.id)
                .populate('sources')
                .then(article => article.sources);
            }
        },
        createdDate: { type: GraphQLString }
    })
});

module.exports = ArticleType;