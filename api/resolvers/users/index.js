
module.exports = {
    getUser: (args, context) => context.db.Users.findOne({
        where: {id: context.user.id}
    })
};
