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
        models.users.bulkCreate(require('./mock-data/users')),
        models.recordTypes.bulkCreate(require('./mock-data/record-types'))
    ]);
}

function onSyncError(err) {
    console.log('Sync error: ' + err);
    process.exit(err.code);
}
