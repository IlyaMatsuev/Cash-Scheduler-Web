
module.exports = {
    getAllIncome: (args, context) => {
        return context.db.Income.findAll({
            where: {
                user_id: context.request.user.id
            },
            include: [
                context.db.Users,
                context.db.RecordTypes,
                context.db.CustomRecordTypes
            ]
        }).then(income => {
            income.forEach(i => {
                if (i.record_type) {
                    i.type = {
                        __typename: 'RecordType',
                        type_name: i.record_type.type_name
                    };
                } else if (i.custom_record_type) {
                    i.type = {
                        __typename: 'CustomRecordType',
                        type_name: i.custom_record_type.type_name,
                        user: context.request.user
                    };
                }
            });
            return income;
        });
    },

    getIncomeByDate: ({date}, context) => {
        return context.db.Income.findOne({
            where: {
                user_id: context.request.user.id,
                date: date
            },
            include: [
                context.db.Users,
                context.db.RecordTypes,
                context.db.CustomRecordTypes
            ]
        }).then(income => {
            income.forEach(i => {
                if (i.record_type) {
                    i.type = {
                        __typename: 'RecordType',
                        type_name: i.record_type.type_name
                    };
                } else if (i.custom_record_type) {
                    i.type = {
                        __typename: 'CustomRecordType',
                        type_name: i.custom_record_type.type_name,
                        user: context.request.user
                    };
                }
            });
            return income;
        });
    },

    addIncome: async ({income}, context) => {
        const providedTypeIsStandard = await context.db.RecordTypes.findOne({
            where: {type_name: income.type}
        });
        const newIncome = {
            ...income,
            user_id: context.request.user.id,
            standard_type: providedTypeIsStandard ? income.type : undefined,
            custom_type: providedTypeIsStandard ? undefined : income.type,
        };

        return context.db.Income.create(newIncome)
            .then(async income => {
                income.user = context.request.user;

                if (providedTypeIsStandard) {
                    income.type = {
                        __typename: 'RecordType',
                        type_name: providedTypeIsStandard.type_name
                    };
                } else {
                    const customRecordType = await context.db.CustomRecordTypes.findOne({
                        where: {
                            user_id: context.request.user.id,
                            type_name: newIncome.type
                        }
                    });
                    if (!customRecordType) {
                        throw new Error('There are no such record types for the user');
                    }
                    income.type = {
                        __typename: 'CustomRecordType',
                        type_name: customRecordType.type_name,
                        user: context.request.user
                    };
                }
                return income;
            });
    },

    removeIncome: ({id}, context) => {
        const oldIncome = {id: id, user_id: context.request.user.id};
        context.db.Income.findOne({
            where: oldIncome,
            include: [
                context.db.Users,
                context.db.RecordTypes,
                context.db.CustomRecordTypes
            ]
        }).then(income => {
            context.db.Income.destroy({where: oldIncome})
                .then(isDeleted => {
                    if (!isDeleted) {
                        throw new Error('Invalid id has been provided for the user income');
                    }
                });
        });
    }
};
