import gql from 'graphql-tag';

export const UPDATE_ARTICLE_TITLE = gql`
    mutation UpdateArticleTitle($id: ID!, $title: String!, $summary: String!) {
        updateArticleTitle(id: $id, title: $title, summary: $summary) {
            id
            title
            summary
        }
    }
`;