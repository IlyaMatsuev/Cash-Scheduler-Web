const notificationWorker = require('./notifications-worker');
const regularTransactionsWorker = require('./regular-transactions-worker');
const config = require('./../config').workers;

module.exports = {
    initWorkers: () => {
        runNotificationsWorker();
        runRegularTransactionsWorker(false);
    }
};

function runNotificationsWorker() {
    setInterval(notificationWorker, config.notifications.sendRefreshInterval);
}

function runRegularTransactionsWorker(runBySchedule) {
    if (runBySchedule) {
        const now = new Date();
        const scheduleRunTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        setTimeout(() => {
            regularTransactionsWorker();
            runRegularTransactionsWorker(false);
        }, scheduleRunTime - now.getTime());
    } else {
        setInterval(regularTransactionsWorker, config.regularTransactions.sendRefreshInterval);
    }
}
