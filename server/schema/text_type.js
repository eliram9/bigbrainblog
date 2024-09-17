const mongoose = require('mongoose');
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString
} = graphql;
const Text = mongoose.model('text');

const TextType = new GraphQLObjectType({
    name: 'TextType',
    fields: () => ({
        id: { type: GraphQLID },
        likes: { type: GraphQLInt },
        paragraph: { type: GraphQLString },
        article: {
        type: require('./article_type'), // Dynamically require to avoid circular dependency
            resolve(parentValue) {
                return Text.findById(parentValue).populate('article')
                .then(text => text.article);
            }
        }
    })
});

module.exports = TextType;
