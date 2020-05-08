const userResolvers = require('./users');
const categoryResolvers = require('./categories');
const transactionResolvers = require('./transactions');
const regularTransactionResolvers = require('./regular-transactions');
const transactionTypeResolvers = require('./transaction-types');
const currencyResolvers = require('./currency');
const notificationResolvers = require('./notifications');
const userSettingResolvers = require('./user-settings');

module.exports = {
    ...userResolvers,
    ...categoryResolvers,
    ...transactionResolvers,
    ...regularTransactionResolvers,
    ...transactionTypeResolvers,
    ...currencyResolvers,
    ...notificationResolvers,
    ...userSettingResolvers
};
