
function refreshAccessToken() {
    const email = window.localStorage.getItem('email');
    const refreshToken = window.localStorage.getItem('refreshToken');

    if (!email || !refreshToken) {
        redirectToLoginPage();
        return;
    }

    return fetch('/auth/token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: email,
            refreshToken: refreshToken
        })
    }).then(response => response.json())
        .then(response => {
            if (response.errors) {
                throw new Error(response.errors[0]);
            } else {
                return rememberTokens({...response, email}, true);
            }
        }).catch(() => redirectToLoginPage());
}

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
                return rememberTokens({...response, email: credentials.email}, credentials.remember);
            }
        });
}

function redirectToProfilePage(token) {
    window.localStorage.setItem('accessToken', token);
    window.location.href = '/views/';
}

function redirectToLoginPage() {
    window.location.href = '/';
}

function checkPageAccess() {
    const accessToken = window.localStorage.getItem('accessToken');

    if (!accessToken) {
        redirectToLoginPage();
        return;
    }

    return fetch('/auth/access', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({accessToken})
    }).then(response => {
        if (response.status === 401) {
            return refreshAccessToken().then(checkPageAccess);
        } else if (response.status === 200) {
            return response;
        } else {
            redirectToLoginPage();
        }
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

function appearBodySlowly(timeout = 500) {
    const pageBody = $('body');
    pageBody.css('display', 'block');
    pageBody.animate({opacity: 1}, timeout);
}
