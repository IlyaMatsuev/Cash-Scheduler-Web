
module.exports = {
    getRecordTypes: (args, context) => context.db.RecordTypes.findAll()
};
