const userResolvers = require('./users');
const recordTypesResolvers = require('./record-types');
const customRecordTypesResolvers = require('./custom-record-types');
const incomeResolvers = require('./income');
const expenseResolvers = require('./expenses');

module.exports = {
    ...userResolvers,
    ...recordTypesResolvers,
    ...customRecordTypesResolvers,
    ...incomeResolvers,
    ...expenseResolvers
};
