import {gql} from '@apollo/client';

export default {
    UPDATED_USER: gql`
        fragment UpdatedUser on User {
            firstName
            lastName
        }
    `
};
