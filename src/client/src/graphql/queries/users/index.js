import {gql} from '@apollo/client';

export default {
    GET_USER: gql`
        query {
            user {
                id
            }
        }
    `,
    GET_USER_WITH_BALANCE: gql`
        query {
            balance
            user {
                id
                firstName
                lastName
                email
            }
        }
    `,
    CHECK_EMAIL: gql`
        query($email: String!) {
            checkEmail(email: $email)
        }
    `,
    CHECK_CODE: gql`
        query($email: String!, $code: String!) {
            checkCode(email: $email, code: $code)
        }
    `,
    GET_APP_TOKEN: gql`
        query {
            appToken
        }
    `
};
