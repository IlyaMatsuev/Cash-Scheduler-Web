
module.exports = (Sequelize, sequelize) =>
    sequelize.define('category', {
        category: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        image_url: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'Images should store in the url format'
                }
            }
        }
    });
