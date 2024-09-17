import gql from 'graphql-tag';

export const UPDATE_ARTICLE_TITLE = gql`
    mutation UpdateArticleTitle($id: ID!, $title: String!) {
        updateArticleTitle(id: $id, title: $title) {
            id
            title
        }
    }
`;