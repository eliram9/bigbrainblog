import gql from 'graphql-tag';

export const DELETE_ARTICLE = gql`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id) {
            id
            title
            createdDate
        }
    }
`;