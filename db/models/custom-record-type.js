
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('custom_record_type', {
        custom_type_name: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    })
};
