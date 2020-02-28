
module.exports = {
    getTransactionTypes: (args, context) => context.db.TransactionTypes.findAll()
};
