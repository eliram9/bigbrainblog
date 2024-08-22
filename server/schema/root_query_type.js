const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const ArticleType = require('./article_type'); // Replaces 'SongType'
const TextType = require('./text_type'); // Replaces 'LyricType'
const Text = mongoose.model('text'); // Replaces 'Lyric'
const Article = mongoose.model('article'); // Replaces 'Song'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    articles: { // Replaces 'songs'
      type: new GraphQLList(ArticleType),
      resolve() {
        return Article.find({});
      }
    },
    article: { // Replaces 'song'
      type: ArticleType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Article.findById(id);
      }
    },
    text: { // Replaces 'lyric'
      type: TextType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Text.findById(id);
      }
    }
  })
});

module.exports = RootQuery;
