
module.exports = (Sequelize, sequelize) =>
    sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 30],
                    msg: 'The first name value is too long'
                }
            }
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 50],
                    msg: 'The last name value is too long'
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'The email field is in wrong format'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        balance: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isFloat: {
                    msg: 'Balance can only contain numbers'
                }
            }
        }
    });
