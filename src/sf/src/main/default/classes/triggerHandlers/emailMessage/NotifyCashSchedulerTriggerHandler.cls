/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

public with sharing class NotifyCashSchedulerTriggerHandler implements ITriggerHandler {

    public void handle(TriggerContext context, ITriggerService service) {
        ICashSchedulerGraphQlService graphQlService = new CashSchedulerGraphQlService();
        for (Notification notification : getNotifications(context.newList)) {
            graphQlService.createNotification(notification);
        }
    }


    private List<Notification> getNotifications(List<EmailMessage> emailMessages) {
        List<Notification> notifications = new List<Notification>();
        Map<Id, Case> relatedCases = getRelatedCases(emailMessages);
        for (EmailMessage emailMessage : emailMessages) {
            if (emailMessage.ParentId != null
                    && relatedCases.containsKey(emailMessage.ParentId)
                    && relatedCases.get(emailMessage.ParentId).ContactId != null
            ) {
                String content = String.isBlank(emailMessage.HtmlBody)
                        ? emailMessage.TextBody
                        : emailMessage.HtmlBody;

                notifications.add(new Notification(
                        emailMessage.Subject,
                        content,
                        relatedCases.get(emailMessage.ParentId).Contact.CashSchedulerId__c
                ));
            }
        }
        return notifications;
    }

    private Map<Id, Case> getRelatedCases(List<EmailMessage> emailMessages) {
        Set<Id> caseIds = new Set<Id>();
        for (EmailMessage emailMessage : emailMessages) {
            if (emailMessage.ParentId != null) {
                caseIds.add(emailMessage.ParentId);
            }
        }
        return new Map<Id, Case>([
                SELECT ContactId, Contact.CashSchedulerId__c
                FROM Case
                WHERE Id IN :caseIds
        ]);
    }
}
