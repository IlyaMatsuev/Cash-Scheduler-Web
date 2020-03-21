const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('./../config').crypt;
const grantedTokens = require('./granted-tokens');
const verificationTokens = require('./verification-tokens');

const self = module.exports = {
    generateTokens(user) {
        return Promise.all([
            self.generateToken(user),
            self.generateToken(user, config.refreshTokenSecret, config.refreshTokenExpIn)
        ]).then(tokens => ({
            accessToken: tokens[0],
            refreshToken: tokens[1]
        }));
    },

    generateToken(user, secret = config.accessTokenSecret, expiredIn = config.accessTokenExpIn) {
        return jwt.sign({user}, secret, {expiresIn: expiredIn});
    },

    generateVerificationToken() {
        return Math.floor(100000 + Math.random() * 900000).toString().substring(0, 7);
    },

    registerNewToken(tokens) {
        grantedTokens[tokens.refreshToken] = tokens;
        save('/granted-tokens.json', grantedTokens);
    },

    registerVerificationToken(email, token) {
        verificationTokens[email] = token;
        save('/verification-tokens.json', verificationTokens);
    },

    unregisterToken(refreshToken) {
        grantedTokens[refreshToken] = undefined;
        save('/granted-tokens.json', grantedTokens);
    },

    unregisterTokenByAccessToken(accessToken) {
        let refreshToken = Object.keys(grantedTokens)
            .find(refreshToken => grantedTokens[refreshToken] && grantedTokens[refreshToken].accessToken === accessToken);
        if (refreshToken) {
            self.unregisterToken(refreshToken);
        }
        return !!refreshToken;
    },

    isRefreshTokenRegistered(refreshToken) {
        return refreshToken && grantedTokens[refreshToken];
    },

    compareVerificationTokens(email, token) {
        return verificationTokens[email] === token;
    }
};

function save(tokensPath, tokens) {
    fs.writeFile(__dirname + tokensPath, JSON.stringify(tokens, null, '  '), err => {
        if (err) {
            console.log(err);
        }
    });
}
