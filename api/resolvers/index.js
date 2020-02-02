const userResolvers = require('./users');
const recordTypesResolvers = require('./record-types');
const customRecordTypesResolvers = require('./custom-record-types');

module.exports = {
    ...userResolvers,
    ...recordTypesResolvers,
    ...customRecordTypesResolvers
};
