
module.exports = {
    getUserSettings: ({unitName}, context) => context.db.UserSettings.findAll({
        where: {
            user_id: context.user.id,
            ...(unitName ? {unit_name: unitName} : {})
        },
        include: [context.db.Users]
    }),

    updateUserSetting: ({setting}, context) => {
        return context.db.UserSettings.findOne({
            where: {
                name: setting.name,
                user_id: context.user.id
            },
            include: [context.db.Users]
        }).then(record => {
            if (!record) {
                return context.db.UserSettings.create({
                    ...setting,
                    user_id: context.user.id
                }).then(record => context.db.UserSettings.findByPk(record.id, {
                    include: [context.db.Users]
                }));
            } else {
                return record.update({value: setting.value}).then(() => record);
            }
        })
    }
};
