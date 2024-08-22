import gql from 'graphql-tag';

export const ADD_NEW_PARAGRAPH = gql`
    mutation AddTextToArticle($articleId: ID!, $paragraph: String!) {
        addTextToArticle(articleId: $articleId, paragraph: $paragraph) {
            id
            texts {
                paragraph
            }
        }
    }
`;