import gql from 'graphql-tag';

export const UPDATE_PARAGRAPH = gql`
    mutation EditParagraph($id: ID!, $paragraph: String!) {
        editParagraph(id: $id, paragraph: $paragraph) {
            id
            paragraph
        }
    }
`;