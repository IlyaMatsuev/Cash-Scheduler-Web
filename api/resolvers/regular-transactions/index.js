
module.exports = {
    getAllRegularTransactions: ({size}, context) => context.db.RegularTransactions.findAll({
        where: {user_id: context.request.user.id},
        include: [context.db.Users, context.db.Categories],
        limit: size
    })
};
