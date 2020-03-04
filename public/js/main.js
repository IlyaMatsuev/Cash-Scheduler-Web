
function requestTokens(credentials) {
    return fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => response.json())
        .then(response => {
            if (response.errors) {
                throw new Error(response.errors[0]);
            } else {
                return rememberTokens(response, credentials.remember);
            }
        });
}

function redirectToProfilePage(token) {
    fetch('/profile', {
        headers: {Authorization: 'Bearer ' + token}
    }).then(response => response.text())
        .then(html => {
            $("html").html(html);
            window.history.pushState({}, "", '/profile');
        });
}

function rememberTokens(tokens, remember = false) {
    Object.keys(tokens).forEach(tokenName => {
        if (remember) {
            window.localStorage.setItem(tokenName, tokens[tokenName]);
        } else {
            window.localStorage.removeItem(tokenName);
        }
    });
    return tokens;
}
