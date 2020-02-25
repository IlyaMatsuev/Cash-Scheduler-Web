
module.exports = (Sequelize, sequelize) =>
    sequelize.define('custom_record_type', {
        type_name: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
