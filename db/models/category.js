
module.exports = (Sequelize, sequelize) =>
    sequelize.define('category', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        transaction_type_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        is_custom: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        image_url: {
            type: Sequelize.STRING,
            defaultValue: '/img/categories/default.jpg'
        }
    }, {
        validate: () => {
            if (this.user_id && !this.is_custom) {
                throw new Error('Category should be custom if you have specified a user');
            } else if (!this.user_id && this.is_custom) {
                throw new Error('You should provide a user id if you want to create a custom category');
            }
        }
    });
