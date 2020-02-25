
module.exports = (Sequelize, sequelize) =>
    sequelize.define('record_type', {
        type_name: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        }
    });
