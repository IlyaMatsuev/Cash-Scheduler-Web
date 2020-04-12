
module.exports = {
    getAllTransactions: ({size}, context) => context.db.Transactions.findAll({
        where: {user_id: context.user.id},
        include: [context.db.Users, context.db.Categories],
        limit: size
    }),
    getTransactionsForLastDays: ({days = 7}, context) => context.db.Transactions.findAll({
        where: {
            user_id: context.user.id,
            date: {
                [context.db.Sequelize.Op.gte]: new Date(Date.now() - days * 24 * 3600 * 1000)
            }
        },
        include: [context.db.Users, context.db.Categories]
    }),

    createTransaction: ({transaction}, context) => context.db.Transactions.create({
        ...transaction,
        user_id: context.user.id
    }).then(record => context.db.Transactions.findByPk(record.id, {
        include: [context.db.Users, context.db.Categories]
    })),
    updateTransaction: ({id, transaction}, context) => context.db.Transactions.findOne({
        where: {
            id: id,
            user_id: context.user.id
        },
        include: [context.db.Users, context.db.Categories]
    }).then(record => {
        if (!record) {
            throw new Error('There are no such transactions with id of ' + id);
        }
        return record.update(transaction);
    }),
    deleteTransaction: ({id}, context) => context.db.Transactions.findOne({
        where: {
            id: id,
            user_id: context.user.id
        },
        include: [context.db.Users, context.db.Categories]
    }).then(record => {
        if (!record) {
            throw new Error('There are no such transactions with id of ' + id);
        }
        return record.destroy().then(() => record);
    })
};
