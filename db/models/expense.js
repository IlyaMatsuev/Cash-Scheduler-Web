
module.exports = (Sequelize, sequelize) =>
    sequelize.define('expense', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        standard_type: {
            type: Sequelize.STRING
        },
        custom_type: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: Date.now(),
            validate: {
                is: /^[0-9]{10}$/
            }
        }
    }, {
        validate: () => {
            if (!this.standard_type && !this.custom_type) {
                throw new Error('The Type of the record must be provided');
            } else if (this.standard_type && this.custom_type) {
                throw new Error('You can\'t provide both standard and custom types');
            }
        }
    });
