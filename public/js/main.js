/*
* OAuth2 / Tokens exchange functionality
*/

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
    window.location.href = '/account/';
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

/*
* API helpers
*/

function graphql(method, query, variables = {}) {
    return fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            query,
            variables
        })
    }).then(response => {
        if (response.status === 401) {
            return refreshAccessToken()
                .then(() => graphql(method, query, variables))
                .then(response => response.json());
        } else {
            return response.json()
        }
    }).then(response => response.data[method]);
}

/*
* View rendering helpers
*/

function appearBodySlowly(timeout = 500) {
    const pageBody = $('body');
    pageBody.show();
    pageBody.animate(
        {opacity: 1},
        timeout,
        () => pageBody.removeClass('hidden-resource')
    );
}

function loadTemplate(template) {
    const accessToken = window.localStorage.getItem('accessToken');
    return fetch(`/account/template?name=${template}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(async response => {
        if (response.status === 200) {
            return response.text();
        } else if (response.status === 401) {
            return refreshAccessToken().then(() => loadTemplate(template));
        } else if (response.status === 403) {
            redirectToLoginPage();
        } else {
            const errors = (await response.json()).errors;
            console.log('Errors: ' + errors);
            throw new Error(errors[0]);
        }
    }).then(setMainView);
}

function setMainView(html) {
    $('main').html(html);
    return html;
}

function changeMainView(template) {
    if (currentView === template) {
        return;
    }
    scrollToNewView(template)
        .then(viewRenderHandlers[template])
        .then(fadeSpinnerOut)
        .then(fadeMainContainerIn)
        .then(() => currentView = template)
        .then(initHandlers);
}
