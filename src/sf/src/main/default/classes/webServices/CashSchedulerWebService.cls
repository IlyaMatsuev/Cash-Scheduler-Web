/**
 * Created by Ilya Matsuev on 3/21/2021.
 */

@RestResource(UrlMapping='/')
global with sharing class CashSchedulerWebService {

    @HttpDelete
    global static void DeleteRecords() {
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;

        Map<String, Object> responseBody = new Map<String, Object> {
                'success' => true,
                'errors' => new List<String>()
        };
        String sObjectTypeName = request.params.get('sobjecttypename');
        List<String> externalIdsList = request.params.get('ids')?.split(',');

        try {
            if (String.isBlank(sObjectTypeName) || externalIdsList == null) {
                throw new CalloutException('sObject type name or external ids params were not specified');
            }

            Set<Integer> externalIds = new Set<Integer>();
            for (String externalIdString : externalIdsList) {
                externalIds.add(Integer.valueOf(externalIdString.trim()));
            }
            String query = 'SELECT Id FROM ' + sObjectTypeName + ' WHERE CashSchedulerId__c IN :externalIds';
            if (sObjectTypeName == Contact.class.getName()) {
                Database.delete([SELECT Id FROM Wallet__c WHERE User__r.CashSchedulerId__c IN :externalIds]);
                Database.delete([SELECT Id FROM Category__c WHERE User__r.CashSchedulerId__c IN :externalIds]);
                Database.delete([SELECT Id FROM Case WHERE Contact.CashSchedulerId__c IN :externalIds]);
            }
            Database.delete(Database.query(query));
        } catch (QueryException error) {
            response.statusCode = 400;
            responseBody.put('success', false);
            ((List<String>) responseBody.get('errors')).add('The request failed while fetching the sObject ' + sObjectTypeName);
            logError(error);
        } catch (DmlException error) {
            response.statusCode = 400;
            responseBody.put('success', false);
            ((List<String>) responseBody.get('errors')).add('The request failed while deleting the records');
            logError(error);
        } catch (CalloutException error) {
            response.statusCode = 400;
            responseBody.put('success', false);
            ((List<String>) responseBody.get('errors')).add(error.getMessage());
            logError(error);
        } catch (Exception error) {
            response.statusCode = 500;
            responseBody.put('success', false);
            ((List<String>) responseBody.get('errors')).add('Something went wrong while performing the request');
            logError(error);
        } finally {
            response.addHeader('Content-Type', 'application/json');
            response.responseBody = Blob.valueOf(JSON.serializePretty(responseBody));
        }
    }


    private static void logError(Exception error) {
        System.debug('==> ERROR: ' + error.getMessage() + '\n' + error.getStackTraceString());
    }
}
