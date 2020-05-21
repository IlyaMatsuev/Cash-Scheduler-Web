
module.exports = (Sequelize, sequelize) =>
    sequelize.define('notification', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        read: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
