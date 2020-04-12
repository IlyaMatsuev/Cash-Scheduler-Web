
module.exports = (Sequelize, sequelize) =>
    sequelize.define('transaction_type', {
        type_name: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        image_url: {
            type: Sequelize.STRING,
            defaultValue: '/img/categories/default.jpg'
        }
    });
