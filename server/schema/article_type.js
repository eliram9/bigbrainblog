const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const TextType = require('./text_type'); // Replaces 'LyricType'
const Article = mongoose.model('article'); // Replaces 'Song'

const ArticleType = new GraphQLObjectType({
  name: 'ArticleType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    texts: {
      type: new GraphQLList(require('./text_type')), // Dynamically require to avoid circular dependency
      resolve(parentValue) {
        return Article.findTexts(parentValue.id);
      }
    }
  })
});

module.exports = ArticleType;
