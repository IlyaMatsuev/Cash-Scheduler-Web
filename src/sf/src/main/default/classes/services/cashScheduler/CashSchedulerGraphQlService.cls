/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

public with sharing class CashSchedulerGraphQlService implements ICashSchedulerGraphQlService {

    private static CashSchedulerServerSettings__c serverSettings {
        get {
            if (serverSettings == null) {
                serverSettings = CashSchedulerServerSettings__c.getOrgDefaults();
            }
            return serverSettings;
        }
        set;
    }

    public void createNotification(Notification notification) {
        GraphQLNode createNotificationNode = new GraphQLNode(
            'createNotification',
            new List<String> { 'id', 'title', 'content', 'isRead' }
        ).withArgument('notification', '$notification');

        GraphQLMutationNode mutation = new GraphQLMutationNode(
            'CreateNotification',
            createNotificationNode
        ).withVariable('notification', 'NewNotificationInput!');

        GraphQLRequest request = mutation.buildRequest()
            .withVariable('notification', notification)
            .withHeader('SfOrigin', UserInfo.getOrganizationId())
            .withHeader('SecurityToken', serverSettings.SecurityToken__c);

        GraphQLResponse response = new GraphQLHttpClient(serverSettings.Endpoint__c).send(request);

        System.debug('Response has errors: ' + response.hasErrors());
        System.debug('Response data: ' + response.getData());
    }
}
