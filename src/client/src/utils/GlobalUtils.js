import {useMutation} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import userMutations from '../graphql/mutations/users';
import errorDefs from './ErrorDefinitions';
import {auth, global, pages, server} from '../config';


export function useLogin(variables, onError) {
    const history = useHistory();
    return useMutation(userMutations.LOGIN_USER, {
        update(proxy, result) {
            localStorage.setItem(auth.accessTokenName, result.data.login.accessToken);
            localStorage.setItem(auth.emailName, variables.email);
            if (variables.remember) {
                localStorage.setItem(auth.refreshTokenName, result.data.login.refreshToken);
            } else {
                localStorage.removeItem(auth.refreshTokenName);
            }
            history.push(pages.homeUrl);
        },
        onError,
        variables: variables
    });
}

export function onUIErrors(error, setErrors, errors) {
    if (error.graphQLErrors?.length > 0 && (
        error.graphQLErrors[0].extensions?.data?.fields
        || error.graphQLErrors[0].extensions?.fields)
    ) {
        const newError = error.graphQLErrors[0];
        if (newError.extensions.data?.fields) {
            newError.extensions.data.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
        } else if (newError.extensions.fields) {
            newError.extensions.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
        } else {
            errors['general'] = newError.message;
        }
    } else if (Object.keys(error.networkError).length > 0 && error.networkError.result.errors[0].extensions) {
        const newError = error.networkError.result.errors[0];
        if (newError.extensions.fields) {
            newError.extensions.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
        } else {
            errors['general'] = newError.message;
        }
    } else {
        Object.keys(errors).forEach(errorField => {
            errors[errorField] = errorDefs.CONNECTION_ERROR;
        });
    }
    setErrors({...errors});
}

export function setTheme(theme) {
    const currentTheme = document.body.getAttribute('theme');
    if (!currentTheme || currentTheme.value !== theme) {
        document.body.setAttribute('theme', theme);
    }
}

export function isUrlAbsolute(url) {
    const link = document.createElement('a');
    link.href = url;
    return `${link.origin}${link.pathname}${link.search}${link.hash}` === url;
}

export function convertToValidIconUrl(url) {
    return isUrlAbsolute(url) ? url : `${server.root}${url}`
}

export function isValidNumber(value) {
    return global.numberInputRegExp.test(value) && !isNaN(Number(value));
}

export function onNumberInput(event) {
    if (!isValidNumber(event.target.value)) {
        event.target.value = event.target.value.slice(0, -1);
    }
}

export function toFloat(value) {
    return Number(Number(value).toFixed(2));
}
