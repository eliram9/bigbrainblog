import { gql } from '@apollo/client';

export const GET_ALL_ARTICLES_QUERY = gql`
    query GetArticles {
        articles {
            id
            title
            author
            category
            openingImageUrl
            summary
            createdDate
        }
    }
`;