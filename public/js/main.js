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
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
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

function getUser() {
    return graphql(
        'getUser',
        'query{getUser{balance, first_name, last_name, email}}'
    );
}

function getSettings() {
    return graphql(
        'getUserSettings',
        'query{getUserSettings{id, name, value, unit_name}}'
    );
}

/*
* View rendering helpers
*/

async function applyViewSettings() {
    const userSettings = await getSettings();
    const showBalanceSetting = userSettings.find(setting => setting.name === 'display-balance-enabled');
    const turnNotificationSoundSetting = userSettings.find(setting => setting.name === 'notification-sound-enabled');
    applySettingsHandlers['display-balance-enabled'](showBalanceSetting && showBalanceSetting.value === 'true');
    applySettingsHandlers['notification-sound-enabled'](turnNotificationSoundSetting && turnNotificationSoundSetting.value === 'true');
}

function appearElementSlowly(selector, timeout = 500) {
    const element = $(selector);
    element.show();
    element.animate(
        {opacity: 1},
        timeout,
        () => element.removeClass('hidden-resource')
    );
}

function disappearElementSlowly(selector, timeout = 500) {
    const element = $(selector);
    element.addClass('hidden-resource');
    element.animate(
        {opacity: 0},
        timeout,
        () => element.hide()
    );
}

function loadTemplate(template, place = 'main', replaceOrAppend = true) {
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
    }).then(template => replaceOrAppend ? setView(template, place) : appendView(template, place));
}

function setView(html, selector) {
    $(selector).html(html);
    return html;
}

function appendView(html, selector) {
    $(selector).append(html);
    return html;
}
