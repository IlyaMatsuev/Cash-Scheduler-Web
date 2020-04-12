
module.exports = {
    getAllRegularTransactions: ({size}, context) => context.db.RegularTransactions.findAll({
        where: {user_id: context.user.id},
        include: [context.db.Users, context.db.Categories],
        limit: size
    }),

    createRegularTransaction: ({transaction}, context) => context.db.RegularTransactions.create({
        ...transaction,
        user_id: context.user.id
    }).then(record => context.db.RegularTransactions.findByPk(record.id, {
        include: [context.db.Users, context.db.Categories]
    })),
    updateRegularTransaction: ({id, transaction}, context) => context.db.RegularTransactions.findOne({
        where: {
            id: id,
            user_id: context.user.id
        },
        include: [context.db.Users, context.db.Categories]
    }).then(record => {
        if (!record) {
            throw new Error('There are no such regular transactions with id of ' + id);
        }
        return record.update(transaction);
    }),
    deleteRegularTransaction: ({id}, context) => context.db.RegularTransactions.findOne({
        where: {
            id: id,
            user_id: context.user.id
        },
        include: [context.db.Users, context.db.Categories]
    }).then(record => {
        if (!record) {
            throw new Error('There are no such regular transactions with id of ' + id);
        }
        return record.destroy().then(() => record);
    })
};
