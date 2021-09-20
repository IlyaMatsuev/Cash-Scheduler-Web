import {gql} from '@apollo/client';

export default {
    GET_SF_ENDPOINT: gql`
        query {
            salesforceApiEndpoint
        }
    `
};
