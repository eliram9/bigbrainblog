import gql from 'graphql-tag';

export const CREATE_NEW_ARTICLE = gql`
mutation CreateArticle($title: String, $author: String, $openingImageUrl: String, $summary: String, $category: String) {
    addArticle(title: $title, author: $author, openingImageUrl: $openingImageUrl, summary: $summary, category: $category) {
        id
        title
        author
        openingImageUrl
        createdDate
        summary
        category
    }
}
`;