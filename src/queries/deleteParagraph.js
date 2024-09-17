import gql from 'graphql-tag';

export const DELETE_PARAGRAPH = gql`
    mutation DeleteParagraph($id: ID!) {
        deleteParagraph(id: $id)
    }
`;