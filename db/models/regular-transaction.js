
module.exports = (Sequelize, sequelize) =>
    sequelize.define('regular_transaction', {
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
        next_transaction_date: {
            type: Sequelize.STRING,
            validate: {
                is: {
                    args: /^[0-9]{10}$/,
                    msg: 'Provide a timestamp for a date value'
                }
            }
        },
        interval: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'month',
            validate: {
                isIntervalValid: value => {
                    const INTERVAL_VALUES = ['day', 'week', 'month', 'year'];
                    if (!INTERVAL_VALUES.includes(value)) {
                        throw new Error(`The "${value}" is an invalid interval value, you can use: ` + INTERVAL_VALUES);
                    }
                }
            }
        }
    });
