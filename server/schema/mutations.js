const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require('mongoose');
const Article = mongoose.model('article'); // Replaces 'Song'
const Text = mongoose.model('text'); // Replaces 'Lyric'
const ArticleType = require('./article_type'); // Replaces 'SongType'
const TextType = require('./text_type'); // Replaces 'LyricType'

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArticle: { // Replaces 'addSong'
            type: ArticleType,
            args: {
                title: { type: GraphQLString }
            },
            resolve(parentValue, { title }) {
                return new Article({ title }).save();
            }
        },
        addTextToArticle: { // Replaces 'addLyricToSong'
            type: ArticleType,
            args: {
                paragraph: { type: GraphQLString },
                articleId: { type: GraphQLID }
            },
            resolve(parentValue, { paragraph, articleId }) {
                return Article.addText(articleId, paragraph); // Updated method call
            }
        },
        likeText: { // Replaces 'likeLyric'
            type: TextType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Text.like(id);
            }
        },
        deleteArticle: { // Replaces 'deleteSong'
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Article.findByIdAndDelete(id);
            }
        }
    }
});

module.exports = mutation;