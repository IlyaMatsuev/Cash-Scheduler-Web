const userResolvers = require('./users');
const categoryResolvers = require('./categories');
const transactionResolvers = require('./transactions');
const regularTransactionResolvers = require('./regular-transactions');
const transactionTypeResolvers = require('./transaction-types');
const currencyResolvers = require('./currency');

module.exports = {
    ...userResolvers,
    ...categoryResolvers,
    ...transactionResolvers,
    ...regularTransactionResolvers,
    ...transactionTypeResolvers,
    ...currencyResolvers
};
