
module.exports = {
    getTransactionTypes: (args, context) => context.db.TransactionTypes.findAll({
        order: [['type_name', 'DESC']]
    })
};
