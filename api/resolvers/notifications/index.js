
module.exports = {
    getAllNotifications: (args, context) => context.db.Notifications.findAll({
        where: {user_id: context.user.id},
        include: [context.db.Users]
    }),
    getUnreadNotifications: (args, context) => context.db.Notifications.findAll({
        where: {
            user_id: context.user.id,
            read: false
        },
        include: [context.db.Users]
    }),

    readNotification: ({id}, context) => context.db.Notifications.findOne({
        where: {
            id: id,
            user_id: context.user.id
        }
    }).then(record => {
        if (!record) {
            throw new Error('There are no notifications with the id of ' + id);
        }
        return record.update({read: true}, {include: [context.db.Users]});
    })
};
