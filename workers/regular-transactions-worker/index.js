const db = require('./../../db');

module.exports = async () => {
    const today = new Date();
    const regularTransactions = await db.RegularTransactions.findAll({
        where: {
            next_transaction_date: {
                [db.Sequelize.Op.lte]: today
            }
        }
    });

    const newSingleTransactions = regularTransactions.map(regularTransaction => ({
        title: regularTransaction.title,
        user_id: regularTransaction.user_id,
        category_id: regularTransaction.category_id,
        amount: regularTransaction.amount,
        date: today
    }));

    regularTransactions.forEach(regularTransaction => {
        let newTransactionDate = today;
        let newTransactionStartFrom = new Date(regularTransaction.next_transaction_date);
        if (regularTransaction.interval === 'year') {
            newTransactionDate = new Date(newTransactionStartFrom.getFullYear() + 1, newTransactionStartFrom.getMonth(), newTransactionStartFrom.getDate());
        } else if (regularTransaction.interval === 'month') {
            newTransactionDate = new Date(newTransactionStartFrom.getFullYear(), newTransactionStartFrom.getMonth() + 1, newTransactionStartFrom.getDate());
        } else if (regularTransaction.interval === 'week') {
            newTransactionDate = new Date(newTransactionStartFrom.getFullYear(), newTransactionStartFrom.getMonth(), newTransactionStartFrom.getDate() + 7);
        } else if (regularTransaction.interval === 'day') {
            newTransactionDate = new Date(newTransactionStartFrom.getFullYear(), newTransactionStartFrom.getMonth(), newTransactionStartFrom.getDate() + 1);
        }

        regularTransaction.update({next_transaction_date: newTransactionDate});
    });

    db.Transactions.bulkCreate(newSingleTransactions);
};
