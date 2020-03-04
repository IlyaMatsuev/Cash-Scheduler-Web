const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('./../config').crypt;
const grantedTokens = require('./granted-tokens');

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

    registerNewToken(tokens) {
        grantedTokens[tokens.refreshToken] = tokens;
        fs.writeFile(__dirname + '/granted-tokens.json', JSON.stringify(grantedTokens, null, '  '), err => {
            if (err) {
                console.log(err);
            }
        });
    },

    unregisterToken(refreshToken) {
        grantedTokens[refreshToken] = undefined;
        fs.writeFile(__dirname + '/granted-tokens.json', JSON.stringify(grantedTokens, null, '  '), err => {
            if (err) {
                console.log(err);
            }
        });
    },

    isRefreshTokenRegistered(refreshToken) {
        return refreshToken && grantedTokens[refreshToken];
    },

    refreshCookies(tokens, response, doUpdate) {
        if (doUpdate) {
            response.cookie('accessToken', tokens.accessToken);
            response.cookie('refreshToken', tokens.refreshToken);
        } else {
            response.clearCookie('accessToken');
            response.clearCookie('refreshToken');
        }
    }
};
