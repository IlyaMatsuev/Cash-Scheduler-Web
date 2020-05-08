
module.exports = (Sequelize, sequelize) =>
    sequelize.define('user_setting', {
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
        value: {
            type: Sequelize.STRING
        },
        unit_name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'settings-general'
        },
        user_id: {
            type: Sequelize.INTEGER
        }
    });
