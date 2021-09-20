
export const server = {
    root: 'https://localhost:8001',
    apiHttpEndpoint: 'https://localhost:8001/graphql',
    apiWSEndpoint: 'wss://localhost:8001/graphql'
};
export const auth = {
    emailName: 'email',
    accessTokenName: 'accessToken',
    refreshTokenName: 'refreshToken',
    authType: 'Bearer'
};
export const recaptcha = {
    siteKey: '6LfugI0aAAAAAFxNWHOCsJf8fDm3yWdSaqG2KBzI'
};
export const pages = {
    loginUrl: '/',
    homeUrl: '/home',
    repositoryUrl: 'https://github.com/IlyaMatsuev/Cash-Scheduler-Web-Client',
    names: {
        dashboard: 'dashboard',
        wallets: 'wallets',
        transactions: 'transactions',
        categories: 'categories',
        settings: 'settings'
    }
};
export const global = {
    dateFormat: 'YYYY-MM-DD',
    numberInputRegExp: /^[\d.,]+$/,
    defaultCurrency: 'USD'
};
export const notifications = {
    volume: 0.5,
    toastDuration: 5000
};
export const dev = {
    user: {
        firstName: 'Ilya',
        lastName: 'Matsuev',
        balance: 1200,
        email: 'mirotvorec542546@gmail.com',
        password: 'adminQ1@'
    }
};
