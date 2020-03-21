
module.exports = {
    getAllCurrencies: (args, context) => context.db.Currency.findAll()
};
