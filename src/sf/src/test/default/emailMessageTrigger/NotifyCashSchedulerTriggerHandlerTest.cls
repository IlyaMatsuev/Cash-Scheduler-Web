/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

@IsTest(IsParallel=true)
private class NotifyCashSchedulerTriggerHandlerTest {

    private static final TestDataFactory dataFactory = new TestDataFactory();

    private static final String CONTACT_FIRST_NAME_1 = 'Joe';
    private static final String CONTACT_LAST_NAME_1 = 'Biden';
    private static final String CONTACT_EMAIL_1 = 'joe.biden@gmail.com';
    private static final String CONTACT_FIRST_NAME_2 = 'Jim';
    private static final String CONTACT_LAST_NAME_2 = 'Carry';
    private static final String CONTACT_EMAIL_2 = 'jim.carry@gmail.com';


    @TestSetup
    private static void setup() {
        CashSchedulerServerSettings__c defaultServerSettings = dataFactory.generateDefaultServerSettings();
        insert defaultServerSettings;

        Account cashSchedulerAccount = dataFactory.generateCashSchedulerAccount();
        insert cashSchedulerAccount;

        List<Contact> contacts = new List<Contact> {
                dataFactory.generateContact(
                        cashSchedulerAccount.Id,
                        1,
                        CONTACT_FIRST_NAME_1,
                        CONTACT_LAST_NAME_1,
                        CONTACT_EMAIL_1
                ),
                dataFactory.generateContact(
                        cashSchedulerAccount.Id,
                        2,
                        CONTACT_FIRST_NAME_2,
                        CONTACT_LAST_NAME_2,
                        CONTACT_EMAIL_2
                )
        };
        insert contacts;

        List<Case> cases = new List<Case> {
                dataFactory.generateCaseWithoutContact(
                        CONTACT_FIRST_NAME_1 + ' ' + CONTACT_LAST_NAME_1,
                        CONTACT_EMAIL_1,
                        'Test1'
                ),
                dataFactory.generateCaseWithoutContact(
                        CONTACT_FIRST_NAME_2 + ' ' + CONTACT_LAST_NAME_2,
                        CONTACT_EMAIL_2,
                        'Test2'
                )
        };
        insert cases;
    }

    @IsTest
    public static void positiveTest() {
        List<EmailMessage> emails = new List<EmailMessage>();
        for (Case cs : getCases()) {
            emails.add(new EmailMessage(
                    FromAddress = UserInfo.getUserEmail(),
                    Incoming = false,
                    ToAddress= cs.Contact.Email,
                    Subject = cs.Subject,
                    TextBody = 'Some resolution...',
                    ParentId = cs.Id
            ));
        }
        Test.setMock(HttpCalloutMock.class, new CashSchedulerGraphQlServerMock());


        Test.startTest();
        insert emails;
        Test.stopTest();


        // NOTE: everything that could be tested were checked in the mock class
        System.assert(true);
    }


    private static List<Case> getCases() {
        return [
                SELECT Subject, Contact.Email
                FROM Case
        ];
    }
}
