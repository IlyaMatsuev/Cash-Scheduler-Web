/**
 * Created by Ilya Matsuev on 3/18/2021.
 */

trigger WalletTrigger on Wallet__c (after insert, after update) {
    TriggerDispatcher.dispatcher
            .bindAsync(
                TriggerOperation.AFTER_INSERT,
                AsyncHandlerType.FUTURE,
                new ReassignDefaultWalletTriggerHandler())
            .bind(
                TriggerOperation.AFTER_UPDATE,
                new ReassignDefaultWalletTriggerHandler())
            .run();
}
