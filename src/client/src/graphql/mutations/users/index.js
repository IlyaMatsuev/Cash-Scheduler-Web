import {gql} from '@apollo/client';

export default {
    REGISTER_USER: gql`
        mutation(
            $firstName: String,
            $lastName: String,
            $balance: Float
            $email: String!,
            $password: String!
        ) {
            register(user: {
                firstName: $firstName
                lastName: $lastName
                balance: $balance
                email: $email
                password: $password
            }) {
                id
                email
            }
        }
    `,
    LOGIN_USER: gql`
        mutation($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                accessToken
                refreshToken
            }
        }
    `,
    RESET_PASSWORD: gql`
        mutation($email: String!, $code: String!, $password: String!) {
            resetPassword(email: $email, code: $code, password: $password) {
                id
                email
            }
        }
    `,
    REFRESH_TOKEN: gql`
        mutation($email: String!, $refreshToken: String!) {
            token(email: $email, refreshToken: $refreshToken) {
                accessToken
                refreshToken
            }
        }
    `,
    LOGOUT_USER: gql`
        mutation { logout {id} }
    `,
    LOGOUT_CONNECTED_APPS: gql`
        mutation { logoutConnectedApps {id} }
    `,
    UPDATE_USER: gql`
        mutation($user: UpdateUserInput!) {
            updateUser(user: $user) {
                id
                firstName
                lastName
            }
        }
    `,
    DELETE_USER: gql`
        mutation($password: String!) {
            deleteUser(password: $password) {
                id
            }
        }
    `
};
