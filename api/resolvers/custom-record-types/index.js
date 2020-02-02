
const self = module.exports = {
    getCustomRecordTypes: ({userId}, context) => context.customRecordTypes.findAll({
        where: {
            user_id: userId
        },
        include: [context.users]
    }),

    createCustomRecordType: ({customRecordType}, context) => context.customRecordTypes.create(customRecordType)
        .then(async newRecordType => {
            newRecordType.user = await context.users.findOne({where: {id: newRecordType.user_id}});
            return newRecordType;
        }),

    deleteCustomRecordType: ({customTypeName, userId}, context) => {
        let oldCustomRecordType = {
            custom_type_name: customTypeName,
            user_id: userId
        };
        return context.customRecordTypes.destroy({where: oldCustomRecordType})
            .then(isDeleted => {
                if (!isDeleted) {
                    throw new Error('No such records have been found. Check input params');
                }
                return context.users.findOne({where: {id: userId}})
            }).then(targetUser => {
                oldCustomRecordType.user = targetUser;
                return oldCustomRecordType;
            });
    },

    updateCustomRecordType: ({oldCustomTypeName, newCustomType}, context) =>
        self.deleteCustomRecordType({customTypeName: oldCustomTypeName, userId: newCustomType.user_id}, context)
            .then(() => self.createCustomRecordType({customRecordType: newCustomType}, context))
};
