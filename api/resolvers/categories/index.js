
module.exports = {
    getAllCategories: (args, context) => context.db.Categories.findAll({
        include: [context.db.Users, context.db.TransactionTypes]
    }),
    getStandardCategories: (args, context) => context.db.Categories.findAll({
        where: {is_custom: false},
        include: [context.db.Users, context.db.TransactionTypes]
    }),
    getCustomCategories: (args, context) => context.db.Categories.findAll({
        where: {user_id: context.user.id, is_custom: true},
        include: [context.db.Users, context.db.TransactionTypes]
    }),

    createCustomCategory: ({category}, context) => context.db.Categories.create({
        ...category,
        user_id: context.user.id,
        is_custom: true
    }).then(record => context.db.Categories.findByPk(record.id, {
        include: [context.db.Users, context.db.TransactionTypes]
    })),
    updateCustomCategory: ({id, category}, context) => context.db.Categories.findOne({
        where: {
            id: id,
            user_id: context.user.id,
            is_custom: true
        },
        include: [context.db.Users, context.db.TransactionTypes]
    }).then(record => {
        if (!record) {
            throw new Error('There are no such categories with id of ' + id);
        }
        return record.update(category);
    }),
    deleteCustomCategory: ({id}, context) => context.db.Categories.findOne({
        where: {
            id: id,
            user_id: context.user.id,
            is_custom: true
        },
        include: [context.db.Users, context.db.TransactionTypes]
    }).then(record => {
        if (!record) {
            throw new Error('There are no such categories with id of ' + id);
        }
        return record.destroy().then(() => record);
    })
};
