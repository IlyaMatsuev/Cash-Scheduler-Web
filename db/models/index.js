const User = require('./user');
const RecordType = require('./record-type');

module.exports = (Sequelize, dbConfig) => {
    const sequelize = new Sequelize(dbConfig.db_name, dbConfig.username, dbConfig.password, dbConfig.options);

    const users = User(Sequelize, sequelize);
    const recordTypes = RecordType(Sequelize, sequelize);

    return {
        users,
        recordTypes,

        sequelize: sequelize,
        Sequelize: Sequelize,
    };
};
