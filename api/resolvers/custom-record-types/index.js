
const self = module.exports = {
    getCustomRecordTypes: (args, context) => context.db.CustomRecordTypes.findAll({
        where: {
            user_id: context.request.user.id
        },
        include: [context.db.Users]
    }),

    createCustomRecordType: ({customRecordType}, context) => {
        return context.db.CustomRecordTypes.create({
            ...customRecordType,
            user_id: context.request.user.id
        }).then(newRecordType => {
            newRecordType.user = context.request.user;
            return newRecordType;
        })
    },

    deleteCustomRecordType: ({customTypeName}, context) => {
        let oldCustomRecordType = {
            type_name: customTypeName,
            user_id: context.request.user.id
        };
        return context.db.CustomRecordTypes.destroy({where: {type_name: customTypeName}})
            .then(isDeleted => {
                if (!isDeleted) {
                    throw new Error('No such records have been found. Check input params');
                }
                oldCustomRecordType.user = context.request.user;
                return oldCustomRecordType;
            });
    },

    updateCustomRecordType: ({oldCustomTypeName, newCustomType}, context) =>
        self.deleteCustomRecordType({customTypeName: oldCustomTypeName}, context)
            .then(() => self.createCustomRecordType({customRecordType: newCustomType}, context))
};
