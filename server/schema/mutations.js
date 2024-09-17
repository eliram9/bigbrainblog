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
        addArticle: { 
            type: ArticleType,
            args: {
                title: { type: GraphQLString },
                author: { type: GraphQLString }
            },
            resolve(parentValue, { title, author }) {
                return new Article({ title, author }).save();
            }
        },
        addTextToArticle: { 
            type: ArticleType,
            args: {
                paragraph: { type: GraphQLString },
                articleId: { type: GraphQLID }
            },
            resolve(parentValue, { paragraph, articleId }) {
                return Article.addText(articleId, paragraph); 
            }
        },
        likeText: { 
            type: TextType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Text.like(id);
            }
        },
        deleteArticle: { 
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Article.findByIdAndDelete(id);
            }
        },
        updateArticleTitle: {
            type: ArticleType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString }
            },
            resolve(parentValue, { id, title }) {
                return Article.findByIdAndUpdate(id, { title }, { new: true });
            }
        },
        deleteParagraph: {
            type: GraphQLID,  // Only return the ID of the deleted paragraph
            args: {
                id: { type: GraphQLID }
            },
            resolve: async (parentValue, { id }) => {
                try {
                    const deletedParagraph = await Text.findByIdAndDelete(id);
                    return deletedParagraph ? deletedParagraph.id : null;
                } catch (err) {
                    throw new Error(`Error deleting paragraph: ${err.message}`);
                }
            }
        }
    }
});

module.exports = mutation;