List<Account> accounts = [
        SELECT Id
        FROM Account
];

if (!accounts.isEmpty()) {
    Database.delete(accounts, false);
}
