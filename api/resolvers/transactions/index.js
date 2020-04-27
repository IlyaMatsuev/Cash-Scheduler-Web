const transactionActionsForBalance = {
    create: 1,
    update: 1,
    delete: -1
};

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

    createTransaction: ({transaction}, context) => {
        return context.db.Transactions.create({
            ...transaction,
            user_id: context.user.id
        }).then(record => {
            return updateUserBalance(context, record.category_id, record.amount, 'create')
                .then(() => context.db.Transactions.findByPk(record.id, {
                    include: [context.db.Users, context.db.Categories]
                }));
        })
    },
    updateTransaction: ({id, transaction}, context) => {
        return context.db.Transactions.findOne({
            where: {
                id: id,
                user_id: context.user.id
            },
            include: [context.db.Users, context.db.Categories]
        }).then(record => {
            if (!record) {
                throw new Error('There are no such transactions with id of ' + id);
            }
            return updateUserBalance(context, record.category_id, transaction.amount - record.amount, 'update')
                .then(() => record.update(transaction));
        })
    },
    deleteTransaction: ({id}, context) => {
        return context.db.Transactions.findOne({
            where: {
                id: id,
                user_id: context.user.id
            },
            include: [context.db.Users, context.db.Categories]
        }).then(record => {
            if (!record) {
                throw new Error('There are no such transactions with id of ' + id);
            }
            return updateUserBalance(context, record.category_id, record.amount, 'delete')
                .then(() => record.destroy()).then(() => record);
        })
    }
};

async function updateUserBalance(context, categoryId, delta, action) {
    const category = await context.db.Categories.findByPk(categoryId);
    if (category.transaction_type_name === 'Income') {
        delta = delta * transactionActionsForBalance[action];
    } else if (category.transaction_type_name === 'Expense') {
        delta = -delta * transactionActionsForBalance[action];
    }
    return context.db.Users.findByPk(context.user.id)
        .then(user => user.update({
            balance: user.balance + delta
        }));
}
