const Sequelize = require('sequelize');

const dbConfig = require('./../config').db;
const models = require('./models')(Sequelize, dbConfig);

module.exports = models;

models.sequelize.sync({force: true})
    .then(onSyncEnded)
    .then(loadMockData)
    .catch(onSyncError);

function onSyncEnded() {
    console.log('Db has been synchronizing');
}

function loadMockData() {
    return Promise.all([
        models.Users.bulkCreate(require('./mock-data/users')),
        models.TransactionTypes.bulkCreate(require('./mock-data/transaction-types'))
    ]).then(() => Promise.all([
        models.Categories.bulkCreate(require('./mock-data/categories'))
    ])).then(() => Promise.all([
        models.Transactions.bulkCreate(require('./mock-data/transactions')),
        models.RegularTransactions.bulkCreate(require('./mock-data/regular-transactions'))
    ]));
}

function onSyncError(error) {
    console.log('Sync error: ' + error);
    process.exit(error.code);
}
