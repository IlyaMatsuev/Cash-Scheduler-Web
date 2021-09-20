/**
 * Created by Ilya Matsuev on 3/18/2021.
 */

public with sharing class ReassignDefaultWalletTriggerHandler implements ITriggerHandler {

    public void handle(TriggerContext context, ITriggerService service) {
        List<Wallet__c> wallets = context.newList;
        Map<Id, Contact> contacts = getContactsByWallets(wallets);
        List<Wallet__c> walletsToResetDefault = new List<Wallet__c>();

        for (Wallet__c wallet : wallets) {
            if (wallet.IsDefault__c) {
                Contact contact = contacts.get(wallet.User__c);
                if (contact?.Wallets__r != null) {
                    for (Wallet__c existingWallet : contact.Wallets__r) {
                        if (existingWallet.IsDefault__c && existingWallet.Id != wallet.Id) {
                            existingWallet.IsDefault__c = false;
                            walletsToResetDefault.add(existingWallet);
                        }
                    }
                }
            }
        }

        TriggerContext.skipAllHandlers();
        Database.update(walletsToResetDefault);
        TriggerContext.doNotSkipAllHandlers();
    }


    private Map<Id, Contact> getContactsByWallets(List<Wallet__c> wallets) {
        Set<Id> contactIds = new Set<Id>();
        for (Wallet__c wallet : wallets) {
            contactIds.add(wallet.User__c);
        }
        return new Map<Id, Contact>([
                SELECT Id, (SELECT Id, IsDefault__c FROM Wallets__r)
                FROM Contact
                WHERE Id IN :contactIds
        ]);
    }
}
