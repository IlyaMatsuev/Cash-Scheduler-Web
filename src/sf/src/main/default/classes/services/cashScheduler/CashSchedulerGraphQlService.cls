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
        GraphQLNode createNotificationNode = new GraphQLNode('CreateNotification')
                .setOperation('mutation')
                .addArguments(new GraphQLArgument('$notification', 'NewNotificationInput!', true))
                .add(new GraphQLNode('createNotification')
                        .addArguments(new GraphQLArgument[]{
                                new GraphQLArgument('notification', '$notification', true)
                        }).add(new Object[]{'id', 'title', 'content', 'isRead'})
                );

        GraphQLQuery createNotificationQuery = new GraphQLQuery(
                createNotificationNode,
                new CreateNotificationVariables(notification)
        );
        RestClientResponse response = new RestClient(serverSettings.Endpoint__c, HttpMethod.POST)
                .withBody(JSON.serialize(createNotificationQuery))
                .withHeader('SfOrigin', UserInfo.getOrganizationId())
                .withHeader('SecurityToken', serverSettings.SecurityToken__c)
                .send();

        System.debug('Response success: ' + response.success);
        System.debug('Response: ' + response.jsonBody);
    }
}
