/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

@IsTest(IsParallel=true)
private class AssignToContactTriggerHandlerTest {

    private static final TestDataFactory dataFactory = new TestDataFactory();

    private static final String CONTACT_FIRST_NAME_1 = 'Joe';
    private static final String CONTACT_LAST_NAME_1 = 'Biden';
    private static final String CONTACT_EMAIL_1 = 'joe.biden@gmail.com';
    private static final String CONTACT_FIRST_NAME_2 = 'Jim';
    private static final String CONTACT_LAST_NAME_2 = 'Carry';
    private static final String CONTACT_EMAIL_2 = 'jim.carry@gmail.com';


    @TestSetup
    private static void setup() {
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
    }

    @IsTest
    public static void positiveTest() {
        List<Case> cases = new List<Case> {
                dataFactory.generateCaseWithoutContact(
                        CONTACT_FIRST_NAME_1 + ' ' + CONTACT_LAST_NAME_1,
                        CONTACT_EMAIL_1,
                        'Test1'
                ),
                dataFactory.generateCaseWithoutContact(
                        CONTACT_FIRST_NAME_1 + ' ' + CONTACT_LAST_NAME_1,
                        CONTACT_EMAIL_1,
                        'Test2'
                ),
                dataFactory.generateCaseWithoutContact(
                        CONTACT_FIRST_NAME_2 + ' ' + CONTACT_LAST_NAME_2,
                        CONTACT_EMAIL_2,
                        'Test3'
                ),
                dataFactory.generateCaseWithoutContact(
                        'Unknown Anonymous',
                        'unknown.anonymous@secret.com',
                        'Test4'
                )
        };


        Test.startTest();
        insert cases;
        Test.stopTest();


        List<Case> createdAssignedCases = getAssignedCases();
        List<Case> createdUnassignedCases = getUnassignedCases();

        System.assertEquals(3, createdAssignedCases.size());
        System.assertEquals(1, createdUnassignedCases.size());

        for (Case cs : createdAssignedCases) {
            System.assertEquals(cs.SuppliedName, cs.Contact.Name);
            System.assertEquals(cs.SuppliedEmail, cs.Contact.Email);
        }
    }


    private static List<Case> getAssignedCases() {
        return [
                SELECT SuppliedName, SuppliedEmail, Contact.Name, Contact.Email
                FROM Case
                WHERE ContactId != NULL
        ];
    }

    private static List<Case> getUnassignedCases() {
        return [
                SELECT SuppliedName, SuppliedEmail, Contact.Name, Contact.Email
                FROM Case
                WHERE ContactId = NULL
        ];
    }
}
