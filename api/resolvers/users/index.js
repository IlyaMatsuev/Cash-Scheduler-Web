const bcrypt = require('bcrypt');
const config = require('./../../../config').crypt;

module.exports = {
    getUserById: ({id}, context) => context.db.Users.findOne({
        where: {
            id: id
        }
    }),
    getUserByEmail: ({email}, context) => context.db.Users.findOne({
        where: {
            email: email
        }
    }),
    getUsers: (args, context) => context.db.Users.findAll(),

    register: ({user}, context) => bcrypt.hash(user.password, config.salt)
        .then(hash => {return {...user, password: hash}})
        .then(user => context.db.Users.create(user))
};
