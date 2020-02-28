
module.exports = {
    getAllTransactions: ({size}, context) => context.db.Transactions.findAll({
        where: {user_id: context.request.user.id},
        include: [context.db.Users, context.db.Categories],
        limit: size
    })
};
