import gql from 'graphql-tag';

export const ADD_SOURCE_TO_ARTICLE = gql`
    mutation AddSourceToArticle($articleId: ID!, $sourceName: String!, $url: String!) {
        addSourceToArticle(articleId: $articleId, sourceName: $sourceName, url: $url) {
            id
            sources {
                id
                sourceName
                url
            }
        }
    }
`;