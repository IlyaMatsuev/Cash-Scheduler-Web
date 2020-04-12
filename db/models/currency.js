
module.exports = (Sequelize, sequelize) =>
    sequelize.define('currency', {
        abbreviation: {
            type: Sequelize.STRING(3),
            primaryKey: true,
            allowNull: false
        },
        rate: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                isFloat: {
                    msg: 'The rate value is invalid. Use floating number'
                }
            }
        },
        icon: {
            type: Sequelize.STRING
        }
    });
