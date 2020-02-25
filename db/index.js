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
        models.RecordTypes.bulkCreate(require('./mock-data/record-types'))
    ]).then(() => Promise.all([
        models.CustomRecordTypes.bulkCreate(require('./mock-data/custom-record-types'))
    ])).then(() => Promise.all([
        models.Income.bulkCreate(require('./mock-data/income')),
        models.Expenses.bulkCreate(require('./mock-data/expenses'))
    ]));
}

function onSyncError(err) {
    console.log('Sync error: ' + err);
    process.exit(err.code);
}
