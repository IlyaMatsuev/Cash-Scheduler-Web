/**
 * Created by Ilya Matsuev on 3/18/2021.
 */

@IsTest(IsParallel=true)
public with sharing class ContactAssignAccountTriggerHandlerTest {

    private static final TestDataFactory dataFactory = new TestDataFactory();


    @IsTest
    public static void positiveTest() {
        Account cashSchedulerAccount = dataFactory.generateCashSchedulerAccount();
        insert cashSchedulerAccount;

        final Integer contactExternalId = 1;
        final String contactFirstName = 'Joe';
        final String contactLastName = 'Biden';
        final String contactEmail = 'joe.biden@gmail.com';

        Contact contact = dataFactory.generateContact(
                null,
                contactExternalId,
                contactFirstName,
                contactLastName,
                contactEmail
        );

        Test.startTest();
        insert contact;
        Test.stopTest();

        List<Contact> createdContacts = [
                SELECT FirstName, LastName, Email, AccountId
                FROM Contact
                WHERE Email = :contactEmail
                LIMIT 1
        ];

        System.assert(!createdContacts.isEmpty());
        System.assertEquals(contactFirstName, createdContacts.get(0).FirstName);
        System.assertEquals(contactLastName, createdContacts.get(0).LastName);
        System.assertEquals(contactEmail, createdContacts.get(0).Email);
        System.assertEquals(cashSchedulerAccount.Id, createdContacts.get(0).AccountId);
    }

    @IsTest
    public static void negativeTestNoAccount() {
        final Integer contactExternalId = 1;
        final String contactFirstName = 'Joe';
        final String contactLastName = 'Biden';
        final String contactEmail = 'joe.biden@gmail.com';

        Contact contact = dataFactory.generateContact(
                null,
                contactExternalId,
                contactFirstName,
                contactLastName,
                contactEmail
        );

        try {
            Test.startTest();
            insert contact;
            Test.stopTest();
        } catch (Exception error) {
            List<Contact> contacts = [
                    SELECT FirstName, LastName, Email, AccountId
                    FROM Contact
                    WHERE Email = :contactEmail
            ];

            System.assert(contacts.isEmpty());
            System.assert(error instanceof DmlException);
            System.assert(error.getMessage().contains(Label.CashSchedulerAccountName));
        }
    }
}
