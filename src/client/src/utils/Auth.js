import {fromPromise} from '@apollo/client';
import userMutations from '../graphql/mutations/users';
import {auth, pages} from '../config';


export function setAuthHeaders(headers) {
    const accessToken = localStorage.getItem(auth.accessTokenName);
    return {
        headers: {
            ...headers,
            Authorization: accessToken ? `${auth.authType} ${accessToken}` : undefined
        }
    };
}

export function logout(apolloClient) {
    localStorage.clear();
    apolloClient.resetStore();
    window.location.replace(pages.loginUrl);
}

export function refreshTokens(apolloClient, operation, forward) {
    return fromPromise(
        apolloClient.mutate({
            mutation: userMutations.REFRESH_TOKEN,
            variables: {
                email: localStorage.getItem(auth.emailName),
                refreshToken: localStorage.getItem(auth.refreshTokenName)
            }
        }).then(response => {
            if (response.data?.token) {
                localStorage.setItem(auth.accessTokenName, response.data.token.accessToken);
                localStorage.setItem(auth.refreshTokenName, response.data.token.refreshToken);
            } else {
                throw new Error();
            }
        }).catch(() => {
            logout(apolloClient);
        })
    ).flatMap(() => {
        operation.setContext(({headers}) => setAuthHeaders(headers));
        return forward(operation);
    });
}
