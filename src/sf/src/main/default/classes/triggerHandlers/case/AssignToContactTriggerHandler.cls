/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

public with sharing class AssignToContactTriggerHandler implements ITriggerHandler {

    public void handle(TriggerContext context, ITriggerService service) {
        List<Case> notAssignedCases = getNotAssignedCases(context.newList);
        Map<String, List<Case>> casesByEmails = getCasesByEmails(notAssignedCases);
        List<Contact> contacts = getContactsByEmails(casesByEmails.keySet());

        for (Contact contact : contacts) {
            for (Case relatedCase : casesByEmails.get(contact.Email)) {
                relatedCase.ContactId = contact.Id;
            }
        }
    }


    private List<Case> getNotAssignedCases(List<Case> cases) {
        List<Case> notAssignedCases = new List<Case>();
        for (Case cs : cases) {
            if (cs.ContactId == null) {
                notAssignedCases.add(cs);
            }
        }
        return notAssignedCases;
    }

    private Map<String, List<Case>> getCasesByEmails(List<Case> cases) {
        Map<String, List<Case>> casesByEmails = new Map<String, List<Case>>();
        for (Case cs : cases) {
            if (!casesByEmails.containsKey(cs.SuppliedEmail)) {
                casesByEmails.put(cs.SuppliedEmail, new List<Case>());
            }
            casesByEmails.get(cs.SuppliedEmail).add(cs);
        }
        return casesByEmails;
    }

    private List<Contact> getContactsByEmails(Set<String> emails) {
        return [
                SELECT Email
                FROM Contact
                WHERE Email IN :emails
        ];
    }
}
