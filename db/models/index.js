const User = require('./user');
const RecordType = require('./record-type');
const CustomRecordType = require('./custom-record-type');

module.exports = (Sequelize, dbConfig) => {
    const sequelize = new Sequelize(dbConfig.db_name, dbConfig.username, dbConfig.password, dbConfig.options);

    const users = User(Sequelize, sequelize);
    const recordTypes = RecordType(Sequelize, sequelize);
    const customRecordTypes = CustomRecordType(Sequelize, sequelize);

    return {
        users,
        recordTypes,
        customRecordTypes,

        sequelize: sequelize,
        Sequelize: Sequelize,
    };
};
