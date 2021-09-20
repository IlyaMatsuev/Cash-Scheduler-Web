/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

@IsTest
public with sharing class CashSchedulerGraphQlServerMock implements HttpCalloutMock {

    public HttpResponse respond(HttpRequest request) {
        System.assertEquals(TestDataFactory.CASH_SCHEDULER_SERVER_ENDPOINT, request.getEndpoint());
        System.assertEquals('POST', request.getMethod());
        System.assert(String.isNotBlank(request.getHeader('SfOrigin')));
        System.assertEquals(UserInfo.getOrganizationId(), request.getHeader('SfOrigin'));
        System.assert(String.isNotBlank(request.getHeader('SecurityToken')));
        System.assertEquals(TestDataFactory.CASH_SCHEDULER_SERVER_SECURITY_TOKEN, request.getHeader('SecurityToken'));
        System.assert(String.isNotBlank(request.getBody()));

        HttpResponse response = new HttpResponse();
        response.setStatusCode(HttpConstants.SUCCESS_STATUS);
        return response;
    }
}
