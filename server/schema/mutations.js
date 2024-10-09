const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require('mongoose');

// Import your models
const Article = mongoose.model('article');
const Text = mongoose.model('text');
const Source = mongoose.model('source');

// Import your GraphQL types
const ArticleType = require('./article_type');
const TextType = require('./text_type');
const SourceType = require('./source_type');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArticle: { 
            type: ArticleType,
            args: {
                title: { type: GraphQLString },
                author: { type: GraphQLString },
                category: {type: GraphQLString},
                summary: {type: GraphQLString},
                openingImageUrl: { type: GraphQLString }
            },
            resolve(parentValue, { title, author, openingImageUrl, category, summary }) {
                return new Article({ title, author, openingImageUrl,category, summary }).save(); // Include openingImageUrl when creating the article
            }
        },
        updateArticleTitle: {
            type: ArticleType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                author: { type: GraphQLString },
                category: { type: GraphQLString },
                openingImageUrl: { type: GraphQLString },
                summary: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                const { id, ...updateFields } = args;
                return Article.findByIdAndUpdate(id, updateFields, { new: true });
            }
        },
        deleteArticle: { 
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Article.findByIdAndDelete(id);
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
        },
        editParagraph: {
            type: TextType,  // Return the updated TextType
            args: {
                id: { type: GraphQLID },
                paragraph: { type: GraphQLString }
            },
            resolve(parentValue, { id, paragraph }) {
                return Text.updateParagraph(id, paragraph);  // Use the updateParagraph method from your schema
            }
        },
        addSourceToArticle: {
            type: ArticleType,
            args: {
              articleId: { type: GraphQLID },
              sourceName: { type: GraphQLString },
              url: { type: GraphQLString },
            },
            async resolve(parentValue, { articleId, sourceName, url }) {
                try {
                    // Create a new source
                    const source = new Source({ sourceName, url });
                    await source.save();
        
                    // Find the article and add the source
                    const article = await Article.findById(articleId);
                    article.sources.push(source);
                    await article.save();
        
                    // Return the updated article
                    return article;
                } catch (error) {
                    throw new Error(error);
                }
            },
        },
        updateSource: {
            type: SourceType,
            args: {
                id: { type: GraphQLID },
                sourceName: { type: GraphQLString },
                url: { type: GraphQLString },
            },
            async resolve(parentValue, { id, sourceName, url }) {
                try {
                    const updatedSource = await Source.findByIdAndUpdate(
                        id,
                        { sourceName, url },
                        { new: true }
                    );
                    return updatedSource;
                } catch (error) {
                    throw new Error(error);
                }
            },
        },
        deleteSource: {
            type: GraphQLID,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parentValue, { id }) {
                try {
                    // Remove the source from any articles that reference it
                    await Article.updateMany(
                        { sources: id },
                        { $pull: { sources: id } }
                    );
        
                    const deletedSource = await Source.findByIdAndDelete(id);
                    return deletedSource ? deletedSource.id : null;
                } catch (error) {
                    throw new Error(error);
                }
            },
        },
        likeText: { 
            type: TextType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Text.like(id);
            }
        }
    }
});

module.exports = mutation;