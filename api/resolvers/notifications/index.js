
module.exports = {
    getAllNotifications: (args, context) => context.db.Notifications.findAll({
        where: {user_id: context.request.user.id},
        include: [context.db.Users]
    }),

    getUnreadNotifications: (args, content) => content.db.Notifications.findAll({
        where: {
            user_id: context.request.user.id,
            read: false
        },
        include: [context.db.Users]
    })
};
