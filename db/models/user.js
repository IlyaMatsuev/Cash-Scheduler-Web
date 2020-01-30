
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // TODO: redesign password field on the model
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
};
