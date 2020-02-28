
module.exports = {
    getAllCategories: (args, context) => context.db.Categories.findAll({
        include: [context.db.Users, context.db.TransactionTypes]
    }),
    getStandardCategories: (args, context) => context.db.Categories.findAll({
        where: {is_custom: false},
        include: [context.db.Users, context.db.TransactionTypes]
    }),
    getCustomCategories: (args, context) => context.db.Categories.findAll({
        where: {user_id: context.request.user.id, is_custom: true},
        include: [context.db.Users, context.db.TransactionTypes]
    })
};
