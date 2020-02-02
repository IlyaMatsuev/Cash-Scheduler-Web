const bcrypt = require('bcrypt');
const cryptConfig = require('./../../../config').crypt;

module.exports = {
    getUserById: ({id}, context) => context.users.findOne({
        where: {
            id: id
        }
    }),
    getUserByEmail: ({email}, context) => context.users.findOne({
        where: {
            email: email
        }
    }),
    getUsers: (args, context) => context.users.findAll(),

    register: ({user}, context) => bcrypt.hash(user.password, cryptConfig.salt)
        .then(hash => {return {...user, password: hash}})
        .then(user => context.users.create(user))
};
