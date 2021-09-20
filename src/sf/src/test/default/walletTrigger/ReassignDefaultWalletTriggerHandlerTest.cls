/**
 * Created by Ilya Matsuev on 3/18/2021.
 */

@IsTest(IsParallel=true)
private class ReassignDefaultWalletTriggerHandlerTest {

    private static final TestDataFactory dataFactory = new TestDataFactory();


    @TestSetup
    private static void setup() {
        TriggerContext.skipAllHandlers();

        Account cashSchedulerAccount = dataFactory.generateCashSchedulerAccount();
        insert cashSchedulerAccount;
        List<Contact> contacts = new List<Contact> {
                dataFactory.generateContact(
                        cashSchedulerAccount.Id,
                        1,
                        'Joe',
                        'Biden',
                        'joe.biden@gmail.com'
                ),
                dataFactory.generateContact(
                        cashSchedulerAccount.Id,
                        2,
                        'Peter',
                        'Dick',
                        'piter.dick@gmail.com'
                ),
                dataFactory.generateContact(
                        cashSchedulerAccount.Id,
                        3,
                        'John',
                        'Johnson',
                        'john.johnson@gmail.com'
                )
        };
        insert contacts;
        List<Wallet__c> wallets = new List<Wallet__c> {
                dataFactory.generateWallet(
                        contacts.get(0).Id,
                        1,
                        'Test Wallet 1',
                        100,
                        'USD',
                        false
                ),
                dataFactory.generateWallet(
                        contacts.get(0).Id,
                        2,
                        'Test Wallet 2',
                        200,
                        'RUB',
                        true
                ),
                dataFactory.generateWallet(
                        contacts.get(1).Id,
                        3,
                        'Test Wallet 3',
                        102,
                        'USD',
                        true
                ),
                dataFactory.generateWallet(
                        contacts.get(1).Id,
                        4,
                        'Test Wallet 4',
                        101,
                        'USD',
                        false
                ),
                dataFactory.generateWallet(
                        contacts.get(2).Id,
                        5,
                        'Test Wallet 5',
                        500,
                        'BYN',
                        true
                )
        };
        insert wallets;

        TriggerContext.doNotSkipAllHandlers();
    }

    @IsTest
    public static void positiveTest() {
        final Integer walletContactId = 1;
        final Integer walletExternalId = 10;
        final String walletName = 'New Default Wallet';
        final Decimal walletBalance = 50.50;
        final String walletCurrencyName = 'EUR';

        Contact oldContact = getContact(walletContactId);
        Wallet__c newWallet = dataFactory.generateWallet(
                oldContact.Id,
                walletExternalId,
                walletName,
                walletBalance,
                walletCurrencyName,
                true
        );

        Test.startTest();
        insert newWallet;
        Test.stopTest();

        Contact contact = getContact(walletContactId);

        System.assertNotEquals(null, contact.Wallets__r);
        System.assert(!contact.Wallets__r.isEmpty());
        System.assertEquals(oldContact.Wallets__r.size() + 1, contact.Wallets__r.size());

        for (Wallet__c wallet : contact.Wallets__r) {
            if (wallet.CashSchedulerId__c == walletExternalId) {
                System.assert(wallet.IsDefault__c);
                System.assertEquals(walletName, wallet.Name);
                System.assertEquals(walletBalance, wallet.Balance__c);
                System.assertEquals(walletCurrencyName, wallet.CurrencyName__c);
            } else {
                System.assert(!wallet.IsDefault__c);
            }
        }
    }

    private static Contact getContact(Integer externalId) {
        return [
                SELECT Id, CashSchedulerId__c, (
                        SELECT Name, Balance__c, CurrencyName__c,
                               IsDefault__c, CashSchedulerId__c
                        FROM Wallets__r
                )
                FROM Contact
                WHERE CashSchedulerId__c = :externalId
                LIMIT 1
        ];
    }
}
