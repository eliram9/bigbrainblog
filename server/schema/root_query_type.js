const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

const ArticleType = require('./article_type');
const TextType = require('./text_type');
const SourceType = require('./source_type'); // Add this line to import SourceType

const Article = mongoose.model('article');
const Text = mongoose.model('text');
const Source = mongoose.model('source'); // Ensure the Source model is imported

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        articles: { 
            type: new GraphQLList(ArticleType),
            resolve() {
                return Article.find({});
            }
        },
        article: { 
            type: ArticleType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, { id }) {
                return Article.findById(id);
            }
        },
        text: { 
            type: TextType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, { id }) {
                return Text.findById(id);
            }
        },
        source: {
            type: SourceType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, { id }) {
              return Source.findById(id);
            }
        }
    })
});

module.exports = RootQuery;
