const User = require('./user');
const RecordType = require('./record-type');
const CustomRecordType = require('./custom-record-type');
const Income = require('./income');
const Expense = require('./expense');

module.exports = (Sequelize, dbConfig) => {
    const sequelize = new Sequelize(dbConfig.db_name, dbConfig.username, dbConfig.password, dbConfig.options);

    const users = User(Sequelize, sequelize);
    const recordTypes = RecordType(Sequelize, sequelize);
    const customRecordTypes = CustomRecordType(Sequelize, sequelize);
    const income = Income(Sequelize, sequelize);
    const expenses = Expense(Sequelize, sequelize);

    income.belongsTo(users, {foreignKey: 'user_id'});
    income.belongsTo(recordTypes, {foreignKey: 'standard_type'});
    income.belongsTo(customRecordTypes, {foreignKey: 'custom_type'});

    expenses.belongsTo(users, {foreignKey: 'user_id'});
    expenses.belongsTo(recordTypes, {foreignKey: 'standard_type'});
    expenses.belongsTo(customRecordTypes, {foreignKey: 'custom_type'});

    recordTypes.hasMany(income);
    recordTypes.hasMany(expenses);

    customRecordTypes.belongsTo(users, {foreignKey: 'user_id'});
    customRecordTypes.hasMany(income);
    customRecordTypes.hasMany(expenses);

    users.hasMany(customRecordTypes);
    users.hasMany(income);
    users.hasMany(expenses);

    return {
        Users: users,
        RecordTypes: recordTypes,
        CustomRecordTypes: customRecordTypes,
        Income: income,
        Expenses: expenses,

        sequelize: sequelize,
        Sequelize: Sequelize,
    };
};
