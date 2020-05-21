const db = require('./../../db');
const EmailManager = require('./../../utils/EmailManager');
const config = require('./../../config');

const alreadySentNotificationsUsers = {};

module.exports = async () => {
    const today = new Date();
    const transactions = await db.Transactions.findAll({
        where: {
            date: {
                [db.Sequelize.Op.gt]: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
            }
        },
        include: [db.Users, db.Categories]
    });

    const transactionsByUsers = getTransactionsByUsersEmails(transactions, today);
    const warningCategoriesByUsersEmails = getWarningCategoriesByUsersEmails(transactionsByUsers);
    notifyUsers(warningCategoriesByUsersEmails);
};

function getTransactionsByUsersEmails(transactions, today) {
    const transactionsByUsers = {};
    transactions.forEach(transaction => {
        if (!alreadySentNotificationsUsers[transaction.user.email] || alreadySentNotificationsUsers[transaction.user.email].getMonth() !== today.getMonth()) {
            if (transactionsByUsers[transaction.user.email]) {
                transactionsByUsers[transaction.user.email].push(transaction);
            } else {
                transactionsByUsers[transaction.user.email] = [transaction];
            }
        }
    });
    return transactionsByUsers;
}

function getWarningCategoriesByUsersEmails(transactionsByUsersEmails) {
    const warningCategoriesByUsers = {};
    Object.keys(transactionsByUsersEmails).forEach(email => {
        const userTransactions = transactionsByUsersEmails[email];
        const categoriesToExpensesAmount = {};
        let summaryExpensesAmount = 0;
        userTransactions.forEach(transaction => {
            if (transaction.category.transaction_type_name === 'Expense') {
                summaryExpensesAmount += transaction.amount;
                if (categoriesToExpensesAmount[transaction.category_id]) {
                    categoriesToExpensesAmount[transaction.category_id] += transaction.amount;
                } else {
                    categoriesToExpensesAmount[transaction.category_id] = transaction.amount;
                }
            }
        });
        Object.keys(categoriesToExpensesAmount).forEach(categoryExpensesAmount => {
            const actualCategoryPercentage = categoriesToExpensesAmount[categoryExpensesAmount] / summaryExpensesAmount;
            if (
                actualCategoryPercentage > config.workers.notifications.warningExpensePercentage
                && categoriesToExpensesAmount[categoryExpensesAmount] > config.workers.notifications.warningAmountLimit
            ) {
                warningCategoriesByUsers[email] = {
                    category_id: categoryExpensesAmount,
                    actualPercentage: actualCategoryPercentage * 100
                };
            }
        });
    });
    return warningCategoriesByUsers;
}

function notifyUsers(warningCategoriesByUsersEmails) {
    Object.keys(warningCategoriesByUsersEmails).forEach(async email => {
        const user = await db.Users.findOne({where: {email}});
        const userSettings = await db.UserSettings.findAll({where: {user_id: user.id}});
        const notificationsEnabled = userSettings.find(setting => setting.name === 'notification-enabled');
        const duplicateToEmail = userSettings.find(setting => setting.name === 'notification-by-email-enabled');

        if (notificationsEnabled && notificationsEnabled.value === 'true') {
            alreadySentNotificationsUsers[email] = new Date();
            const category = await db.Categories.findByPk(warningCategoriesByUsersEmails[email].category_id);
            const newNotification = {
                title: config.workers.notifications.warningNotification.title,
                content: config.workers.notifications.warningNotification.content
                    .replace('$$$', category.name)
                    .replace('@@', Math.round(warningCategoriesByUsersEmails[email].actualPercentage * 100) / 100),
                user_id: user.id,
                read: false
            };
            db.Notifications.create(newNotification);
            if (duplicateToEmail && duplicateToEmail.value === 'true') {
                EmailManager.send(newNotification.title, newNotification.content, email);
            }
        }
    });
}
