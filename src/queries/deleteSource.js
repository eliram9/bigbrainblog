import gql from 'graphql-tag';

export const DELETE_SOURCE = gql`
    mutation DeleteSource($id: ID!) {
        deleteSource(id: $id)
    }
`;