const Sequelize = require('sequelize');
const getModels = require('./models');
const dbConfig = require('./../config').db;

let dbCredentials;
try {
    dbCredentials = require('./../credentials').db;
    dbCredentials.options = dbConfig;
} catch (e) {
    dbCredentials = {
        db_name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    };
    dbCredentials.options = dbConfig;
    dbCredentials.options.host = process.env.DB_HOST;
}

const models = getModels(Sequelize, dbCredentials);

module.exports = models;

models.sequelize.sync({force: true})
    .then(loadMockData)
    .then(onSyncFinished)
    .catch(onSyncError);

function onSyncFinished() {
    console.log('Db has been synchronizing');
}
function loadMockData() {
    return Promise.all([
        models.Users.bulkCreate(require('./mock-data/users')),
        models.TransactionTypes.bulkCreate(require('./mock-data/transaction-types'))
    ]).then(() => Promise.all([
        models.Categories.bulkCreate(require('./mock-data/categories')),
        models.Notifications.bulkCreate(require('./mock-data/notifications'))
    ])).then(() => Promise.all([
        models.Transactions.bulkCreate(require('./mock-data/transactions')),
        models.RegularTransactions.bulkCreate(require('./mock-data/regular-transactions')),
        models.Currencies.bulkCreate(require('./mock-data/currencies'))
    ]));
}
function onSyncError(error) {
    console.log('Sync error: ' + error);
    process.exit(error.code);
}
