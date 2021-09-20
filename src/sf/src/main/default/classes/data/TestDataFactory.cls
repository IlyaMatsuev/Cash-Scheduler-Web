/**
 * Created by Ilya Matsuev on 3/18/2021.
 */

public with sharing class TestDataFactory {

    public static final String CASH_SCHEDULER_SERVER_ENDPOINT = 'https://cash-scheduler-test.com/test';
    public static final String CASH_SCHEDULER_SERVER_SECURITY_TOKEN = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';


    public CashSchedulerServerSettings__c generateDefaultServerSettings() {
        return new CashSchedulerServerSettings__c(
                SetupOwnerId = UserInfo.getOrganizationId(),
                Endpoint__c = CASH_SCHEDULER_SERVER_ENDPOINT,
                SecurityToken__c = CASH_SCHEDULER_SERVER_SECURITY_TOKEN
        );
    }

    public Account generateCashSchedulerAccount() {
        return new Account(
                Name = Label.CashSchedulerAccountName,
                Industry = 'Technology',
                Type = 'Customer - Direct',
                Website = 'http://localhost:3000/'
        );
    }

    public Contact generateContact(
            Id accountId,
            Integer externalId,
            String firstName,
            String lastName,
            String email
    ) {
        return new Contact(
                AccountId = accountId,
                CashSchedulerId__c = externalId,
                FirstName = firstName,
                LastName = lastName,
                Email = email
        );
    }

    public Case generateCaseWithoutContact(
            String name,
            String email,
            String subject
    ) {
        return new Case(
                SuppliedName = name,
                SuppliedEmail = email,
                Subject = subject,
                Description = subject
        );
    }

    public Wallet__c generateWallet(
            Id contactId,
            Integer externalId,
            String name,
            Decimal balance,
            String currencyName,
            Boolean isDefault
    ) {
        return new Wallet__c(
                User__c = contactId,
                CashSchedulerId__c = externalId,
                Name = name,
                Balance__c = balance,
                CurrencyName__c = currencyName,
                IsDefault__c = isDefault
        );
    }
}
