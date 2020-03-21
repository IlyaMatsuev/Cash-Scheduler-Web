const User = require('./user');
const Category = require('./category');
const Transaction = require('./transaction');
const TransactionType = require('./transaction-type');
const RegularTransaction = require('./regular-transaction');
const Currency = require('./currency');

module.exports = (Sequelize, dbConfig) => {
    const sequelize = new Sequelize(
        dbConfig.db_name,
        dbConfig.username,
        dbConfig.password,
        dbConfig.options
    );

    const users = User(Sequelize, sequelize);
    const categories = Category(Sequelize, sequelize);
    const transactions = Transaction(Sequelize, sequelize);
    const transactionTypes = TransactionType(Sequelize, sequelize);
    const regularTransactions = RegularTransaction(Sequelize, sequelize);
    const currency = Currency(Sequelize, sequelize);

    categories.belongsTo(transactionTypes, {foreignKey: 'transaction_type_name'});
    categories.belongsTo(users, {foreignKey: 'user_id'});

    transactions.belongsTo(users, {foreignKey: 'user_id'});
    transactions.belongsTo(categories, {foreignKey: 'category_id'});

    regularTransactions.belongsTo(users, {foreignKey: 'user_id'});
    regularTransactions.belongsTo(categories, {foreignKey: 'category_id'});

    return {
        Users: users,
        Categories: categories,
        Transactions: transactions,
        TransactionTypes: transactionTypes,
        RegularTransactions: regularTransactions,
        Currency: currency,

        sequelize: sequelize,
        Sequelize: Sequelize,
    };
};
