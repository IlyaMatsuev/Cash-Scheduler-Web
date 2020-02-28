
module.exports = {
    getUserById: ({id}, context) => context.db.Users.findOne({
        where: {id: id}
    }),
    getUserByEmail: ({email}, context) => context.db.Users.findOne({
        where: {email: email}
    }),
    getUsers: (args, context) => context.db.Users.findAll()
};
