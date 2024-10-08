import gql from 'graphql-tag';

export const UPDATE_ARTICLE_TITLE = gql`
    mutation UpdateArticleTitle(
        $id: ID!,
        $title: String!,
        $author: String!,
        $category: String!,
        $openingImageUrl: String,
        $summary: String!
    ) {
        updateArticleTitle(
            id: $id,
            title: $title,
            author: $author,
            category: $category,
            openingImageUrl: $openingImageUrl,
            summary: $summary
        ) {
            id
            title
            author
            category
            openingImageUrl
            summary
        }
    }
`;