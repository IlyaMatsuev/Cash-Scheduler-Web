
module.exports = {
    getUser: (args, context) => context.db.Users.findOne({
        where: {user_id: context.user.id}
    })
};
