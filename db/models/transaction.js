
module.exports = (Sequelize, sequelize) =>
    sequelize.define('transaction', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [0, 30],
                    msg: 'The title is too long'
                }
            }
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                min: {
                    args: 0.01,
                    msg: 'The min value for the amount field is 0.01'
                },
                isFloat: {
                    msg: 'The amount field should be a number'
                }
            }
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            validate: {
                isDate: {
                    args: true,
                    msg: 'Invalid date format, try this one - YYYY-MM-DD'
                }
            }
        }
    });
