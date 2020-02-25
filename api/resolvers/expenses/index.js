
module.exports = {
    getAllExpenses: (args, context) => {
        return context.db.Expenses.findAll({
            where: {
                user_id: context.request.user.id
            },
            include: [
                context.db.Users,
                context.db.RecordTypes,
                context.db.CustomRecordTypes
            ]
        }).then(expenses => {
            expenses.forEach(e => {
                if (e.record_type) {
                    e.type = {
                        __typename: 'RecordType',
                        type_name: e.record_type.type_name
                    };
                } else if (e.custom_record_type) {
                    e.type = {
                        __typename: 'CustomRecordType',
                        type_name: e.custom_record_type.type_name,
                        user: context.request.user
                    };
                }
            });
            return expenses;
        });
    },

    getExpensesByDate: ({date}, context) => {
        return context.db.Expenses.findOne({
            where: {
                user_id: context.request.user.id,
                date: date
            },
            include: [
                context.db.Users,
                context.db.RecordTypes,
                context.db.CustomRecordTypes
            ]
        }).then(expenses => {
            expenses.forEach(e => {
                if (e.record_type) {
                    e.type = {
                        __typename: 'RecordType',
                        type_name: e.record_type.type_name
                    };
                } else if (e.custom_record_type) {
                    e.type = {
                        __typename: 'CustomRecordType',
                        type_name: e.custom_record_type.type_name,
                        user: context.request.user
                    };
                }
            });
            return expenses;
        });
    },

    addExpense: async ({expense}, context) => {
        const providedTypeIsStandard = await context.db.RecordTypes.findOne({
            where: {type_name: expense.type}
        });
        const newExpense = {
            ...expense,
            user_id: context.request.user.id,
            standard_type: providedTypeIsStandard ? expense.type : undefined,
            custom_type: providedTypeIsStandard ? undefined : expense.type,
        };

        return context.db.Expenses.create(newExpense)
            .then(async expense => {
                expense.user = context.request.user;

                if (providedTypeIsStandard) {
                    expense.type = {
                        __typename: 'RecordType',
                        type_name: providedTypeIsStandard.type_name
                    };
                } else {
                    const customRecordType = await context.db.CustomRecordTypes.findOne({
                        where: {
                            user_id: context.request.user.id,
                            type_name: newExpense.type
                        }
                    });
                    if (!customRecordType) {
                        throw new Error('There are no such record types for the user');
                    }
                    expense.type = {
                        __typename: 'CustomRecordType',
                        type_name: customRecordType.type_name,
                        user: context.request.user
                    };
                }
                return expense;
            });
    },

    removeExpense: ({id}, context) => {
        const oldExpense = {id: id, user_id: context.request.user.id};
        context.db.Expenses.findOne({
            where: oldExpense,
            include: [
                context.db.Users,
                context.db.RecordTypes,
                context.db.CustomRecordTypes
            ]
        }).then(expense => {
            context.db.Expenses.destroy({where: oldExpense})
                .then(isDeleted => {
                    if (!isDeleted) {
                        throw new Error('Invalid id has been provided for the user expense');
                    }
                });
        });
    }
};
