import gql from 'graphql-tag';

export const UPDATE_SOURCE = gql`
    mutation UpdateSource($id: ID!, $sourceName: String!, $url: String!) {
        updateSource(id: $id, sourceName: $sourceName, url: $url) {
            id
            sourceName
            url
        }
    }
`;